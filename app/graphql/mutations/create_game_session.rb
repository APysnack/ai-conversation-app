
module Mutations
  class CreateGameSession < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :message, String, null: false
    field :game_session, Types::Models::GameSessionType, null: true

    argument :user_one_id, ID, required: true
    argument :user_two_id, ID, required: true
    argument :condition, String, required: true
    argument :system_settings, GraphQL::Types::JSON, required: false

    def resolve(
      user_one_id:,
      user_two_id:,
      condition:,
      system_settings: nil
    )
      current_user = context[:current_user]

      unless current_user&.has_role?(:admin)
        return failure("You are not authorized to create game sessions.")
      end

      unless GameSession::CONDITIONS.include?(condition)
        return failure("Invalid game condition.")
      end

      user_one = User.find_by(id: user_one_id)
      user_two = User.find_by(id: user_two_id)

      unless user_one && user_two
        return failure("One or both participants could not be found.")
      end

      if user_one.id == user_two.id
        return failure("Participants must be different people.")
      end

      unless has_submitted_pre_game_survey?(user_one)
        return failure("#{user_one.email} has not completed the pre-game survey.")
      end

      unless has_submitted_pre_game_survey?(user_two)
        return failure("#{user_two.email} has not completed the pre-game survey.")
      end

      # Use the supplied settings or fall back to the defaults.
      settings = system_settings.presence || GameConfiguration::SYSTEM_SETTINGS

      game_session = GameSession.new(
        user_one: user_one,
        user_two: user_two,
        condition: condition,
        status: "pending",
        system_settings: settings
      )

      if game_session.save
        {
          success: true,
          message: "Game session created successfully.",
          game_session: game_session
        }
      else
        failure(game_session.errors.full_messages.join(", "))
      end
    end

    private

    def has_submitted_pre_game_survey?(user)
      settings = user.settings || {}

      survey =
        settings["preGameSurvey"] ||
        settings[:preGameSurvey]

      survey.is_a?(Hash) && survey.any?
    end

    def failure(message)
      {
        success: false,
        message: message,
        game_session: nil
      }
    end
  end
end
