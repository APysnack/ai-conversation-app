module Types
  class SignInPayloadType < BaseObject
    field :success, Boolean, null: false, description: "Whether sign in was successful"
    field :message, String, null: false, description: "Response message"
    field :user, Types::Models::UserType, null: true, description: "The signed in user"
    field :token, String, null: true, description: "JWT token"
  end
end
