module Mutations
  class SignIn < GraphQL::Schema::Resolver
    type Types::SignInPayloadType, null: true
    description "Sign in a user with email and password"
    argument :email, String, required: true, description: "User email"
    argument :password, String, required: true, description: "User password"

    def resolve(email:, password:)
      user = User.find_by(email: email)
      
      if user&.valid_password?(password)
        token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
        
        # Store token in context to be set as cookie in controller
        context[:auth_token] = token
        context[:auth_user] = user
        
        {
          success: true,
          message: 'Signed in successfully',
          user: user,
        }
      else
        {
          success: false,
          message: 'Invalid email or password',
          user: nil,
        }
      end
    end
  end
end
