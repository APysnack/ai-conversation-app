module Queries
  class GameSessionForPresentation < GraphQL::Schema::Resolver
    type Types::Models::GameSessionType, null: false

    description "Get a game session and its participants for researcher presentation. Admin access only."

    argument :id, ID, required: true

    def resolve(id:)
      current_user = context[:current_user]

      unless current_user&.has_role?(:admin)
        raise GraphQL::ExecutionError, "Not authorized"
      end

      game_session = ::GameSession
        .includes(
          :user_one,
          :user_two,
          game_participations: :user
        )
        .find_by(id: id)

      unless game_session
        raise GraphQL::ExecutionError, "Game session not found"
      end

      game_session
    end
  end
end
