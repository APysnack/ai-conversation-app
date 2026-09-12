module Types
  class SignOutPayloadType < BaseObject
    field :success, Boolean, null: false, description: "Whether sign out was successful"
    field :message, String, null: false, description: "Response message"
  end
end
