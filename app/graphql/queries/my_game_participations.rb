module Queries
  class MyGameParticipations < GraphQL::Schema::Resolver
    type [Types::Models::GameParticipationType], null: false

    description "Get the current user's game participation records"

    def resolve
      user = context[:current_user]

      return [] unless user

      user.game_participations
          .includes(:game_session)
          .order(created_at: :desc)
    end
  end
end