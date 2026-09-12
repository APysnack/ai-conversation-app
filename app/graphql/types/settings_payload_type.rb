module Types
  class SettingsPayloadType < BaseObject
    field :success, Boolean, null: false, description: "Whether update was successful"
    field :message, String, null: false, description: "Response message"
    field :user, Types::Models::UserType, null: true, description: "The updated user"
  end
end
