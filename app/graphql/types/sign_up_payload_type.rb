module Types
  class SignUpPayloadType < BaseObject
    field :success, Boolean, null: false, description: "Whether sign up was successful"
    field :message, String, null: false, description: "Response message"
    field :user, Types::Models::UserType, null: true, description: "The created user"
    field :token, String, null: true, description: "JWT token"
  end
end
