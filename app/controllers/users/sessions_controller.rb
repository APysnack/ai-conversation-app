# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  private 

  def respond_with(resource, _opts = {})
    if resource.persisted?
      token = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil).first
      
      # Set token as HTTP-only, Secure cookie
      cookies.encrypted[:_auth_token] = {
        value: token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        expires: 3.months.from_now
      }
      
      render json: {
        code: 200,
        message: 'Logged in successfully',
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }
    else
      render json: {
        code: 401,
        message: 'Invalid email or password'
      }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    # Clear the auth token cookie
    cookies.delete(:_auth_token, same_site: :lax)
    
    if current_user
      render json: {
        status: 200, 
        message: "logged out successfully"
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
