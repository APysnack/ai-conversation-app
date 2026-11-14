module Types
  module Models
    class GameSessionType < Types::BaseObject
      field :id, ID, null: false
      field :condition, String, null: false
      field :status, String, null: false
      field :system_settings, GraphQL::Types::JSON, null: false

      field :user_one, Types::Models::UserType, null: false
      field :user_two, Types::Models::UserType, null: false

      field :game_participations, [Types::Models::GameParticipationType], null: false

      field :created_at, String, null: false
      field :updated_at, String, null: false

      def game_participations
        GameParticipation
          .where(game_session_id: object.id)
          .includes(:user)
          .order(:created_at)
      end
    end
  end
end
