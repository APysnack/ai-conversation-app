module Queries
  class Users < GraphQL::Schema::Resolver
    include AuthorizedResolver
    
    type [Types::Models::UserType], null: false
    description "Get all users"

    def resolve
      authorize_admin_or_member!
      ::User.all
    end
  end
end
