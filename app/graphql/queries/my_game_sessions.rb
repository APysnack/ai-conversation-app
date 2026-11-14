module Queries
  class MyGameSessions < GraphQL::Schema::Resolver
    type [Types::Models::GameSessionType], null: false

    description "Get game sessions belonging to the current user"

    def resolve
      user = context[:current_user]

      return [] unless user

      ::GameSession
        .where(user_one: user)
        .or(::GameSession.where(user_two: user))
        .order(created_at: :desc)
    end
  end
end
