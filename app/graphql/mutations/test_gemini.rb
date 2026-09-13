require "json"

module Mutations
  class TestGemini < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :questions, [String], null: false

    def resolve
      user = context[:current_user]

      return {
        success: false,
        questions: []
      } unless user

      response = GeminiService.test(user.settings["survey"])

      parsed_response = JSON.parse(response)

      {
        success: true,
        questions: parsed_response["questions"]
      }
    rescue StandardError => e
      Rails.logger.error("Gemini error: #{e.class}: #{e.message}")
      Rails.logger.error(e.backtrace.first(5).join("\n"))

      {
        success: false,
        questions: []
      }
    end
  end
end