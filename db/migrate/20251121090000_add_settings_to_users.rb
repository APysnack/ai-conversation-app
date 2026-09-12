class AddSettingsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :settings, :jsonb, default: {}, null: false
  end
end
