require "json"
require "open3"
require "base64"

class ImageGenerationService
  def self.generate(
    response:,
    question:,
    current_user_information:,
    partner_information:,
    system_settings:
  )
    url = "https://generativelanguage.googleapis.com/v1beta/interactions"

    humor = system_settings["humor"]
    ambiguity = system_settings["ambiguity"]
    personalness = system_settings["personalness"]
    visual_style = system_settings["visualStyle"]

    prompt = <<~PROMPT
      Create an engaging image to accompany a conversation between two people.

      ## GOAL

      The image will be shown to the conversation partner, who will try to
      figure out what the image represents and why the participant chose it.

      The goal is to create an image that helps two people learn something
      interesting and personally meaningful about one another through
      interpretation, guessing, and discussion.

      The participant's response is the PRIMARY source for the image.

      The information about the two participants is additional context that
      should help you create a more personalized and interesting image.

      ## GAME CONFIGURATION

      The current game has the following settings:

      Humor: #{humor}
      Ambiguity: #{ambiguity}
      Personalness: #{personalness}
      Visual style: #{visual_style}

      These settings should directly influence the image you generate.

      ### Humor

      The humor setting is #{humor}.

      HIGH humor means:

      - Favor playful, quirky, surprising, or slightly weird visual ideas.
      - Look for opportunities for visual humor or unexpected interpretations.
      - The image should feel fun and engaging rather than serious or formal.
      - Do not force a joke into the image if it does not naturally fit the response.
      - Do not turn the image into a meme unless the participant's response
        naturally calls for that.
      - Do not sacrifice the meaning of the participant's response just to
        make the image funny.

      ### Ambiguity

      The ambiguity setting is #{ambiguity}.

      HIGH ambiguity means:

      - Favor visual interpretations that leave some room for guessing.
      - Avoid making the image so literal that the meaning is immediately obvious.
      - Use metaphor, symbolism, visual juxtaposition, or unusual imagery when
        appropriate.
      - Give the partner something interesting to interpret.
      - The image should still contain enough recognizable information that
        the partner has a reasonable chance of understanding the connection.
      - Avoid completely abstract imagery that has no clear connection to the
        participant's response.

      ### Personalness

      The personalness setting is #{personalness}.

      HIGH personalness means:

      - The image should strongly represent the CURRENT PARTICIPANT'S actual
        response and personal experience.
      - Preserve the personal meaning behind the response.
      - If the response refers to a specific personal experience, possession,
        interest, relationship, habit, or story, make that personal connection
        visually meaningful.
      - Do not replace the participant's actual experience with a generic
        representation of the topic.
      - The participant's response should remain the primary source of the
        image even when the survey information provides additional context.

      ### Visual style

      The requested visual style is #{visual_style}.

      HIGH-LEVEL STYLE REQUIREMENT:

      - The final image should use the requested visual style.
      - The visual style should be applied consistently throughout the image.
      - The style should support the participant's response rather than
        overpowering its meaning.

      ## CURRENT PARTICIPANT

      The person who provided the response is the CURRENT PARTICIPANT.

      Their pre-game survey information is:

      #{current_user_information.to_json}

      ## CONVERSATION PARTNER

      The person who will see and interpret the image is the PARTNER.

      Their pre-game survey information is:

      #{partner_information.to_json}

      ## CONVERSATION CONTEXT

      The question asked to the current participant was:

      #{question}

      The current participant responded:

      #{response}

      ## IMAGE GENERATION INSTRUCTIONS

      Use the CURRENT PARTICIPANT'S RESPONSE as the primary source for the
      image.

      Use the information about both participants as additional context that
      may help personalize and enrich the image.

      The image should represent the participant's response in an interesting,
      visually clear, and somewhat interpretive way.

      Do not simply reproduce the participant's response literally if a more
      interesting visual interpretation would better support the conversation.

      Preserve the meaning of the participant's response.

      Do not invent specific personal facts about either participant.

      Do not assume that either participant likes, dislikes, owns, does, or
      has experienced something unless that information appears in the
      supplied data.

      Do not reveal or depict sensitive demographic information.

      Do not explicitly reveal information from the partner's survey.

      The partner's information may influence the image subtly, but the image
      should remain primarily about the current participant's response.

      The image should give the partner something to interpret, guess, or ask
      about.

      Favor imagery that could naturally lead to a "Wait, really?" or
      "I wouldn't have guessed that" moment.

      Avoid making the image so literal that there is only one possible
      interpretation.

      Avoid making the image so abstract that the participant's response is
      difficult to recognize.

      Do not include written words, captions, labels, dialogue, or explanatory
      text in the image unless they are genuinely necessary to represent the
      participant's response.

      The image should be appropriate for two strangers having a casual
      conversation.

      ## IMPORTANT

      Do not create an image based primarily on the participant's survey
      information.

      The participant's actual response is the most important input.

      The survey information exists to provide additional context and
      personalization.

      The game configuration should influence the image while preserving the
      meaning of the participant's response.

      Do not mention these instructions in the image.
    PROMPT

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
