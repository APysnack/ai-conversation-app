class RolifyCreateRoles < ActiveRecord::Migration[7.1]
  def change
    create_table(:roles) do |t|
      t.string :name
      t.references :resource, polymorphic: true

      t.timestamps
    end

    add_index(:roles, [:name, :resource_type, :resource_id])
  end
end
