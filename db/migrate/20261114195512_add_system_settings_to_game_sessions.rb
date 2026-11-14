class AddSystemSettingsToGameSessions < ActiveRecord::Migration[7.1]
  def change
    add_column :game_sessions, :system_settings, :jsonb, null: false, default: {}
  end
end