
require "json"

module Mutations
  class TestGemini < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :questions, [GraphQL::Types::JSON], null: false

    argument :participation_id, ID, required: true

    def resolve(participation_id:)
      user = context[:current_user]

      return {
        success: false,
        questions: []
      } unless user

      # Find the current user's participation.
      participation = user.game_participations.find_by(
        id: participation_id
      )

      return {
        success: false,
        questions: []
      } unless participation

      game_session = participation.game_session

      # Question generation is only for AI-mediated sessions.
      unless game_session.condition == "ai_mediated"
        return {
          success: false,
          questions: []
        }
      end

      # Determine the other participant from the shared game session.
      partner =
        if game_session.user_one_id == user.id
          game_session.user_two
        else
          game_session.user_one
        end

      # Retrieve both participants' pregame surveys.
      current_user_survey =
        user.settings&.dig("preGameSurvey") || {}

      partner_survey =
        partner.settings&.dig("preGameSurvey") || {}

      # Read configuration directly from the game session.
      system_settings =
        game_session.system_settings.presence ||
        GameConfiguration::SYSTEM_SETTINGS

      # Generate the questions.
      response = GeminiService.test(
        current_user_survey,
        partner_survey,
        system_settings
      )

      parsed_response = JSON.parse(response)
      questions = parsed_response["questions"]

      unless questions.is_a?(Array) && questions.length == 3
        raise "Gemini did not return exactly three questions."
      end

      # Preserve existing preparation data.
      existing_data = participation.preparation_data || {}

      updated_data = existing_data.merge(
        "questions" => questions
      )

      # Save the questions to this participant's record.
      participation.update!(
        preparation_data: updated_data
      )

      {
        success: true,
        questions: questions
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
