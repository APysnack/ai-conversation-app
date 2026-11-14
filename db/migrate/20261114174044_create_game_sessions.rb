class CreateGameSessions < ActiveRecord::Migration[7.1]
  def change
    create_table :game_sessions do |t|
      t.references :user_one,
                   null: false,
                   foreign_key: { to_table: :users }

      t.references :user_two,
                   null: false,
                   foreign_key: { to_table: :users }

      t.string :condition, null: false
      t.string :status, null: false, default: "pending"

      t.timestamps
    end
  end
end
