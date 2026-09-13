require "json"
require "open3"
require "base64"

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
      puts "Image generation request failed: #{stderr}"
      return placeholder_image
    end

    body = JSON.parse(stdout)

    if body["error"]
      puts "Gemini image API error: #{body["error"]["message"]}"
      return placeholder_image
    end

    unless body["status"] == "completed"
      puts "Gemini image generation did not complete. Status: #{body["status"]}"
      return placeholder_image
    end

    image = body.fetch("steps", [])
      .select { |step| step["type"] == "model_output" }
      .flat_map { |step| step.fetch("content", []) }
      .find do |content|
        content["type"] == "image" && content["data"].present?
      end

    unless image
      puts "=== GEMINI DID NOT RETURN AN IMAGE ==="
      puts JSON.pretty_generate(body)
      puts "======================================"

      return placeholder_image
    end

    {
      data: image["data"],
      mime_type: image["mime_type"] || "image/jpeg"
    }
  rescue JSON::ParserError => e
    puts "Failed to parse Gemini response: #{e.message}"
    placeholder_image
  rescue StandardError => e
    puts "Image generation error: #{e.class}: #{e.message}"
    placeholder_image
  end

  def self.placeholder_image
    svg = <<~SVG
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
        <rect width="1024" height="1024" fill="#eeeeee"/>
        <text
          x="512"
          y="470"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="56"
          fill="#444444">
          Image unavailable
        </text>
        <text
          x="512"
          y="550"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="32"
          fill="#777777">
          This response couldn't be turned into an image.
        </text>
      </svg>
    SVG

    {
      data: Base64.strict_encode64(svg),
      mime_type: "image/svg+xml"
    }
  end
end