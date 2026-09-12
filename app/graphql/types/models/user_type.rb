module Types
  module Models
    class UserType < Types::BaseObject
      field :id, ID, null: false
      field :email, String, null: false
      field :settings, GraphQL::Types::JSON, null: false, description: "User settings stored as JSONB"
      field :created_at, String, null: false
      field :updated_at, String, null: false
    end
  end
end
