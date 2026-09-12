module Types
  class QueryType < BaseObject
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :user, resolver: Queries::User
    field :users, resolver: Queries::Users
    field :current_user, Types::Models::UserType, null: true, description: "Get the current authenticated user"

    def current_user
      context[:current_user]
    end
  end
end
