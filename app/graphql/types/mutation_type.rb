module Types
  class MutationType < BaseObject
    field :sign_in, resolver: Mutations::SignIn
    field :sign_up, resolver: Mutations::SignUp
    field :sign_out, resolver: Mutations::SignOut
    field :update_settings, resolver: Mutations::UpdateSettings
    field :test_gemini, resolver: Mutations::TestGemini
  end
end
