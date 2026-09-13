require "json"
require "open3"

class GeminiService
  def self.test(participant_information = nil)
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"

    participant_information ||= "[PARTICIPANT INFORMATION WILL GO HERE]"

    prompt = <<~PROMPT
      You are helping facilitate a conversation between two people who have just met.

      Your task is to generate THREE short, open-ended personal prompts for a participant. The participant will answer each prompt by creating an image using an AI image generator. Their images will then be shown to another participant, who will try to figure out what the images represent and why the participant chose them.

      The purpose of the activity is to help two strangers learn something interesting and personally meaningful about one another through interpretation, guessing, and discussion.

      ## What makes a good prompt

      Each prompt should:

      - Give the participant an opportunity to reveal something about themselves.
      - Be easy to answer by describing or creating an image.
      - Have enough ambiguity that the resulting image could reasonably be interpreted in more than one way.
      - Encourage the participant to tell a story or explain something about themselves after the image is revealed.
      - Create an opportunity for the other person to ask follow-up questions.
      - Ideally produce a "Wait, really?" or "I wouldn't have guessed that" moment.
      - Be fun, imaginative, or slightly unusual when appropriate.
      - Feel natural for someone answering it with a stranger.
      - Avoid requiring the participant to reveal anything deeply private, traumatic, sexual, political, or otherwise sensitive.

      The prompts should NOT simply ask for a factual preference such as "What is your favorite movie?" or "What is your favorite food?" Instead, look for a question that can turn an interest, experience, personality trait, or unusual fact into a story.

      For example, instead of:

      "What is your favorite hobby?"

      Prefer something like:

      "Describe a hobby or activity that has become an important part of your life."

      Or:

      "Describe an experience involving one of your interests that you still remember."

      The participant should be able to answer each prompt in their own way. Do not tell them exactly what image to create.

      ## Use the participant information

      You will receive information about the participant from a pre-game survey.

      Use this information as raw material for selecting interesting conversational directions. You do NOT need to use every piece of information.

      Look for combinations, unusual details, potential stories, and topics that the participant is likely to enjoy discussing.

      Do not simply repeat one of their survey answers in the prompt. Instead, use their information to create a doorway into a more personal conversation.

      For example, if a participant indicates that they enjoy music, travel, and collecting things, you might create a prompt that combines those interests into an opportunity to describe a meaningful musical or travel-related memory.

      Prioritize prompts that are likely to reveal something the other participant could not easily learn from ordinary small talk.

      ## Avoid

      Do not:

      - Ask yes/no questions.
      - Ask questions that can be answered with a single word.
      - Require highly personal or sensitive disclosure.
      - Assume facts that are not present in the participant's information.
      - Make the prompt so specific that there is only one obvious image to create.
      - Make the prompt so abstract that the participant does not know how to answer it.
      - Explicitly tell the participant what image to generate.
      - Mention that AI generated the prompt.
      - Mention the other participant.
      - Explain why you selected the prompt.

      ## Desired characteristics

      Aim for:

      Personal: The answer should tell the other person something about the participant.

      Visual: The answer should naturally lend itself to an interesting image.

      Ambiguous: The resulting image should leave room for interpretation.

      Conversational: The answer should naturally invite questions or explanation.

      Unexpected: Whenever possible, create an opportunity for surprise.

      Appropriate: The prompt should be comfortable for two strangers.

      ## Participant information

      Participant information will be provided below.

      #{participant_information.to_json}

      ## Output

      Return exactly THREE prompts.

      Return your response as JSON in exactly this format:

      {
        "questions": [
          "Prompt 1",
          "Prompt 2",
          "Prompt 3"
        ]
      }

      Return ONLY the JSON object. Do not include markdown, code fences, explanations, labels, or additional commentary.
    PROMPT

    request_body = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }.to_json

    puts "=== GEMINI REQUEST ==="
    puts request_body
    puts "====================="

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