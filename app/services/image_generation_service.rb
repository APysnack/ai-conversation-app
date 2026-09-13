require "json"
require "open3"

class ImageGenerationService
  def self.generate(prompt)
    url = "https://generativelanguage.googleapis.com/v1beta/interactions"

    request_body = {
      model: "gemini-3.1-flash-image",
      input: prompt,
      response_format: {
        type: "image",
        mime_type: "image/jpeg",
        aspect_ratio: "1:1",
        image_size: "1K"
      }
    }.to_json

    puts "=== IMAGE GENERATION REQUEST ==="
    puts request_body
    puts "================================"

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
      raise "Image generation request failed: #{stderr}"
    end

    body = JSON.parse(stdout)

    if body["error"]
      raise "Gemini image API error: #{body["error"]["message"]}"
    end

    image = body["output_image"]

    unless image
      raise "Gemini did not return an image"
    end

    {
      data: image["data"],
      mime_type: image["mime_type"]
    }
  end
end