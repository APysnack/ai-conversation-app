module Types
  module Models
    class GameParticipationType < Types::BaseObject
      field :id, ID, null: false

      field :user, Types::Models::UserType, null: false
      field :game_session, Types::Models::GameSessionType, null: false

      field :preparation_data, GraphQL::Types::JSON, null: false
      field :generated_images, GraphQL::Types::JSON, null: false
      field :post_game_survey, GraphQL::Types::JSON, null: false

      field :conversation_completed_at, String, null: true

      field :created_at, String, null: false
      field :updated_at, String, null: false
    end
  end
end