require "json"

module Mutations
  class TestGemini < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :questions, [GraphQL::Types::JSON], null: false

    argument :partner_user_id, String, required: true
    argument :system_settings, GraphQL::Types::JSON, required: true

    def resolve(partner_user_id:, system_settings:)
      user = context[:current_user]

      return {
        success: false,
        questions: []
      } unless user

      partner = User.find(partner_user_id)

      current_user_survey =
        user.settings["preGameSurvey"] || {}

      partner_survey =
        partner.settings["preGameSurvey"] || {}

      response = GeminiService.test(
        current_user_survey,
        partner_survey,
        system_settings
      )

      parsed_response = JSON.parse(response)

      {
        success: true,
        questions: parsed_response["questions"]
      }
    rescue StandardError => e
      Rails.logger.error(
        "Gemini error: #{e.class}: #{e.message}"
      )

      Rails.logger.error(
        e.backtrace.first(5).join("\n")
      )

      {
        success: false,
        questions: []
      }
    end
  end
end