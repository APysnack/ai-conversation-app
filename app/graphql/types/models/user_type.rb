
module Types
  module Models
    class UserType < Types::BaseObject
      field :id, ID, null: false
      field :email, String, null: false
      field :settings, GraphQL::Types::JSON,
            null: false,
            description: "User settings stored as JSONB"
      field :is_admin, Boolean, null: false
      field :created_at, String, null: false
      field :updated_at, String, null: false

      def is_admin
        object.has_role?(:admin)
      end
    end
  end
end
