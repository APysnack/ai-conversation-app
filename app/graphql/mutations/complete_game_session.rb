module Mutations
  class CompleteGameSession < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :message, String, null: false
    field :game_session, Types::Models::GameSessionType, null: true

    argument :id, ID, required: true

    def resolve(id:)
      current_user = context[:current_user]

      unless current_user&.has_role?(:admin)
        raise GraphQL::ExecutionError, "Not authorized"
      end

      game_session = ::GameSession.find_by(id: id)

      unless game_session
        return {
          success: false,
          message: "Game session not found",
          game_session: nil
        }
      end

      game_session.update!(status: "completed")

      {
        success: true,
        message: "Game session completed successfully",
        game_session: game_session
      }
    rescue ActiveRecord::RecordInvalid => e
      {
        success: false,
        message: e.message,
        game_session: nil
      }
    end
  end
end
