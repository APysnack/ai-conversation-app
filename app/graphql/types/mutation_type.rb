module Types
  class MutationType < BaseObject
    field :sign_in, resolver: Mutations::SignIn
    field :sign_up, resolver: Mutations::SignUp
    field :sign_out, resolver: Mutations::SignOut

    field :update_settings, resolver: Mutations::UpdateSettings
    field :test_gemini, resolver: Mutations::TestGemini
    field :generate_images, resolver: Mutations::GenerateImages
    field :complete_game_session, mutation: Mutations::CompleteGameSession

    field :create_game_session,
          mutation: Mutations::CreateGameSession

    field :update_game_participation,
          mutation: Mutations::UpdateGameParticipation
  end
end