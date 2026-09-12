module Mutations
  class SignUp < GraphQL::Schema::Resolver
    type Types::SignUpPayloadType, null: true
    description "Sign up a new user"
    argument :email, String, required: true, description: "User email"
    argument :password, String, required: true, description: "User password"
    argument :password_confirmation, String, required: true, description: "Password confirmation"

    def resolve(email:, password:, password_confirmation:)
      if User.exists?(email: email)
        return {
          success: false,
          message: 'Email already exists',
          user: nil,
        }
      end

      user = User.new(email: email, password: password, password_confirmation: password_confirmation)
      
      if user.save
        token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
        
        # Store token in context to be set as cookie in controller
        context[:auth_token] = token
        context[:auth_user] = user
        
        {
          success: true,
          message: 'Account created successfully',
          user: user,
        }
      else
        {
          success: false,
          message: user.errors.full_messages.join(', '),
          user: nil,
        }
      end
    end
  end
end
