module Mutations
  class SignOut < GraphQL::Schema::Resolver
    type Types::SignOutPayloadType, null: true
    description "Sign out the current user"

    def resolve
      context[:should_clear_auth] = true
      
      if context[:current_user]
        {
          success: true,
          message: 'Signed out successfully'
        }
      else
        {
          success: false,
          message: 'No active session'
        }
      end
    end
  end
end
