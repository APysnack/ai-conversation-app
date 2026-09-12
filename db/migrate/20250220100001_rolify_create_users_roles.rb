class RolifyCreateUsersRoles < ActiveRecord::Migration[7.1]
  def change
    create_table(:users_roles) do |t|
      t.references :user
      t.references :role
    end

    add_index(:users_roles, [:user_id, :role_id])
  end
end
