module Mutations
  class GenerateImages < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :images, [String], null: false

    argument :game_id, String, required: true
    argument :interactions, [GraphQL::Types::JSON], required: true

    def resolve(game_id:, interactions:)
      user = context[:current_user]

      return {
        success: false,
        images: []
      } unless user

      saved_interactions = []

    interactions.each do |interaction|
      question = interaction["question"]
      image_prompt = interaction["response"]

      begin
        result = ImageGenerationService.generate(image_prompt)

        image_data = "data:#{result[:mime_type]};base64,#{result[:data]}"

        saved_interactions << {
          "question" => question,
          "response" => image_prompt,
          "imageUrl" => image_data
        }
      rescue StandardError => e
        Rails.logger.error("Image generation failed for interaction: #{e.message}")

        saved_interactions << {
          "question" => question,
          "response" => image_prompt,
          "imageUrl" => nil
        }
      end
    end

      game_data = {
        "gameId" => game_id,
        "interactions" => saved_interactions
      }

      user.update_settings(
        "gameData" => [
          game_data
        ]
      )

      {
        success: true,
        images: saved_interactions.map { |interaction| interaction["imageUrl"] }
      }
    rescue StandardError => e
      Rails.logger.error("Image generation error: #{e.class}: #{e.message}")
      Rails.logger.error(e.backtrace.first(5).join("\n"))

      {
        success: false,
        images: []
      }
    end
  end
end