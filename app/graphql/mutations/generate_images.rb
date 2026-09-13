module Mutations
  class GenerateImages < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :images, [String], null: false

    argument :answers, [String], required: true

    def resolve(answers:)
      user = context[:current_user]

      return {
        success: false,
        images: []
      } unless user

      images = answers.map do |_answer|
        result = ImageGenerationService.generate(
          "Generate a simple placeholder image for a conversation game."
        )

        "data:#{result[:mime_type]};base64,#{result[:data]}"
      end

      {
        success: true,
        images: images
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