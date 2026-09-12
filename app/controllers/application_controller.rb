class ApplicationController < ActionController::API
  include Devise::Controllers::Helpers
  include ActionController::Cookies

  before_action :extract_jwt_from_cookies

  private

  def extract_jwt_from_cookies
    if cookies.encrypted[:_auth_token].present?
      request.headers['Authorization'] = "Bearer #{cookies.encrypted[:_auth_token]}"
    end
  end
end
