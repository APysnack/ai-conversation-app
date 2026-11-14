
module Mutations
  class GenerateImages < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :images, [String], null: false

    argument :game_id, String, required: true
    argument :partner_user_id, String, required: true
    argument :interactions, [GraphQL::Types::JSON], required: true

    def resolve(
      game_id:,
      partner_user_id:,
      interactions:
    )
      user = context[:current_user]

      return failure unless user

      # Find the shared game session.
      game_session = GameSession.find_by(id: game_id)

      return failure unless game_session.condition == "ai_mediated"

      # Make sure the current user actually belongs to this session.
      participation = game_session.game_participations.find_by(
        user_id: user.id
      )

      return failure unless participation

      # Determine the other participant from the session itself.
      partner = if game_session.user_one_id == user.id
        game_session.user_two
      elsif game_session.user_two_id == user.id
        game_session.user_one
      end

      return failure unless partner

      # Verify that the requested partner is the actual session partner.
      return failure unless partner.id.to_s == partner_user_id.to_s

      partner_participation = game_session.game_participations.find_by(
        user_id: partner.id
      )

      return failure unless partner_participation

      # Pre-game surveys are still stored in User.settings for now.
      current_pre_game_survey =
        user.settings&.dig("preGameSurvey") || {}

      partner_pre_game_survey =
        partner.settings&.dig("preGameSurvey") || {}

      # Read configuration directly from the game session.
      system_settings =
        game_session.system_settings.presence ||
        GameConfiguration::SYSTEM_SETTINGS

      generated_images = []

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

          generated_images << image_data
        rescue StandardError => e
          Rails.logger.error(
            "Image generation failed: #{e.class}: #{e.message}"
          )

          generated_images << nil
        end
      end

      # Save images to this participant's record, not User.settings.
      participation.update!(
        generated_images: generated_images
      )

      {
        success: true,
        images: generated_images
      }
    rescue StandardError => e
      Rails.logger.error(
        "Image generation error: #{e.class}: #{e.message}"
      )

      Rails.logger.error(
        e.backtrace.first(5).join("\n")
      )

      failure
    end

    private

    def failure
      {
        success: false,
        images: []
      }
    end
  end
end
