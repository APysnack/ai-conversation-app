module Queries
  class User < GraphQL::Schema::Resolver
    include AuthorizedResolver
    
    type Types::Models::UserType, null: false
    description "Get a user by ID"
    argument :id, ID, required: true

    def resolve(id:)
      authorize_admin!
      ::User.find(id)
    end
  end
end
