require "json"
require "open3"

class GeminiService
  def self.test
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"

    request_body = {
      contents: [
        {
          parts: [
            {
              text: "Say hello in one short sentence."
            }
          ]
        }
      ]
    }.to_json

    command = [
      "curl",
      "-s",
      "-X", "POST",
      url,
      "-H", "Content-Type: application/json",
      "-H", "x-goog-api-key: #{Rails.application.credentials.gemini_api_key}",
      "-d", request_body
    ]

    stdout, stderr, status = Open3.capture3(*command)

    unless status.success?
      raise "Gemini request failed: #{stderr}"
    end

    body = JSON.parse(stdout)

    if body["error"]
      raise "Gemini API error: #{body["error"]["message"]}"
    end

    body.dig(
      "candidates",
      0,
      "content",
      "parts",
      0,
      "text"
    )
  end
end