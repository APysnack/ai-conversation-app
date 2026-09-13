module Mutations
  class GenerateImages < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :images, [String], null: false

    argument :game_id, String, required: true
    argument :partner_user_id, String, required: true
    argument :interactions, [GraphQL::Types::JSON], required: true
    argument :system_settings, GraphQL::Types::JSON, required: true

    def resolve(
      game_id:,
      partner_user_id:,
      interactions:,
      system_settings:
    )
      user = context[:current_user]

      return {
        success: false,
        images: []
      } unless user

      partner = User.find_by(id: partner_user_id)

      return {
        success: false,
        images: []
      } unless partner

      current_pre_game_survey =
        user.settings&.dig("preGameSurvey") || {}

      partner_pre_game_survey =
        partner.settings&.dig("preGameSurvey") || {}

      # Use the settings selected for this particular game.
      # Fall back to the default configuration if necessary.
      system_settings ||=
        GameConfiguration::SYSTEM_SETTINGS

      saved_interactions = []

      interactions.each do |interaction|
        question = interaction["question"]
        image_prompt = interaction["response"]

        begin
          result = ImageGenerationService.generate(
            response: image_prompt,
            question: question,
            current_user_information: current_pre_game_survey,
            partner_information: partner_pre_game_survey,
            system_settings: system_settings
          )

          image_data =
            "data:#{result[:mime_type]};base64,#{result[:data]}"

          saved_interactions << {
            "question" => question,
            "response" => image_prompt,
            "imageUrl" => image_data
          }
        rescue StandardError => e
          Rails.logger.error(
            "Image generation failed for interaction: #{e.message}"
          )

          saved_interactions << {
            "question" => question,
            "response" => image_prompt,
            "imageUrl" => nil
          }
        end
      end

      game_data = {
        "gameId" => game_id,
        "partnerUserId" => partner_user_id,
        "partnerEmail" => partner.email,
        "partnerPreGameSurvey" => partner_pre_game_survey,
        "systemSettings" => system_settings,
        "interactions" => saved_interactions
      }

      # Preserve previous games instead of replacing gameData.
      existing_game_data =
        user.settings&.dig("gameData") || []

      user.update_settings(
        "gameData" => existing_game_data + [game_data]
      )

      {
        success: true,
        images: saved_interactions.map {
          |interaction| interaction["imageUrl"]
        }
      }
    rescue StandardError => e
      Rails.logger.error(
        "Image generation error: #{e.class}: #{e.message}"
      )

      Rails.logger.error(
        e.backtrace.first(5).join("\n")
      )

      {
        success: false,
        images: []
      }
    end
  end
end