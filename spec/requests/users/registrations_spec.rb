require 'rails_helper'

RSpec.describe "Users::Registrations", type: :request do
  describe "POST /users" do
    let(:valid_params) do
      {
        user: {
          email: "test@example.com",
          password: "password123",
          password_confirmation: "password123"
        }
      }
    end

    let(:invalid_params) do
      {
        user: {
          email: "invalid-email",
          password: "short",
          password_confirmation: "different"
        }
      }
    end

    context "with valid params" do
      it "returns a success JSON message" do
        post "/signup", params: valid_params, as: :json

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["status"]["code"]).to eq(200)
        expect(json["status"]["message"]).to eq("Signed up successfully")
        expect(json["data"]["email"]).to eq("test@example.com")
      end
    end

    context "with invalid params" do
      it "returns an error JSON message" do
        post "/signup", params: invalid_params, as: :json

        expect(response).to have_http_status(422)
        json = JSON.parse(response.body)
        expect(json["status"]["message"]).to include("User could not be created")
      end
    end
  end
end
