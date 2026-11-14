
module Types
  class QueryType < BaseObject
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :user, resolver: Queries::User
    field :users, resolver: Queries::Users

    field :current_user,
          Types::Models::UserType,
          null: true,
          description: "Get the current authenticated user"

    field :my_game_sessions, resolver: Queries::MyGameSessions

    field :all_game_sessions, resolver: Queries::AllGameSessions

    field :my_game_participations,
          resolver: Queries::MyGameParticipations

    field :game_session_for_presentation,
          resolver: Queries::GameSessionForPresentation

    def current_user
      context[:current_user]
    end
  end
end
