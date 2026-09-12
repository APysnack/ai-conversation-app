module Mutations
  class UpdateSettings < GraphQL::Schema::Mutation
    description "Update current user's settings (merges provided keys)"

    argument :settings, GraphQL::Types::JSON, required: true, description: "Settings object to merge"

    field :success, Boolean, null: false, description: "Whether update was successful"
    field :message, String, null: false, description: "Response message"
    field :user, Types::Models::UserType, null: true, description: "The updated user"

    def resolve(settings:)
      user = context[:current_user]
      return { success: false, message: 'Unauthorized', user: nil } unless user

      if user.update_settings(settings)
        { success: true, message: 'Settings updated', user: user }
      else
        { success: false, message: user.errors.full_messages.to_sentence, user: nil }
      end
    end
  end
end
