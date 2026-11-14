# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_11_14_203652) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "game_participations", force: :cascade do |t|
    t.bigint "game_session_id", null: false
    t.bigint "user_id", null: false
    t.jsonb "preparation_data", default: {}, null: false
    t.jsonb "generated_images", default: [], null: false
    t.jsonb "post_game_survey", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "conversation_completed_at"
    t.index ["game_session_id", "user_id"], name: "index_game_participations_on_session_and_user", unique: true
    t.index ["game_session_id"], name: "index_game_participations_on_game_session_id"
    t.index ["user_id"], name: "index_game_participations_on_user_id"
  end

  create_table "game_sessions", force: :cascade do |t|
    t.bigint "user_one_id", null: false
    t.bigint "user_two_id", null: false
    t.string "condition", null: false
    t.string "status", default: "pending", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "system_settings", default: {}, null: false
    t.index ["user_one_id"], name: "index_game_sessions_on_user_one_id"
    t.index ["user_two_id"], name: "index_game_sessions_on_user_two_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.jsonb "settings", default: {}, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_roles", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  add_foreign_key "game_participations", "game_sessions"
  add_foreign_key "game_participations", "users"
  add_foreign_key "game_sessions", "users", column: "user_one_id"
  add_foreign_key "game_sessions", "users", column: "user_two_id"
end
