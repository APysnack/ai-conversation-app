
module Queries
  class AllGameSessions < GraphQL::Schema::Resolver
    type [Types::Models::GameSessionType], null: false

    description "Get all game sessions. Admin access only."

    def resolve
      current_user = context[:current_user]

      unless current_user&.has_role?(:admin)
        raise GraphQL::ExecutionError, "Not authorized"
      end

      ::GameSession
        .includes(:user_one, :user_two)
        .order(created_at: :desc)
    end
  end
end
