
class CreateGameParticipations < ActiveRecord::Migration[7.1]
  def change
    create_table :game_participations do |t|
      t.references :game_session,
                   null: false,
                   foreign_key: true

      t.references :user,
                   null: false,
                   foreign_key: true

      t.jsonb :preparation_data, null: false, default: {}
      t.jsonb :generated_images, null: false, default: []
      t.jsonb :post_game_survey, null: false, default: {}

      t.timestamps
    end

    add_index :game_participations,
              [:game_session_id, :user_id],
              unique: true,
              name: "index_game_participations_on_session_and_user"
  end
end
