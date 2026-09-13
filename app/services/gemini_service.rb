require "json"
require "open3"

class GeminiService
  def self.test(current_user_information = nil, partner_information = nil)
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"

    current_user_information ||= "[CURRENT PARTICIPANT INFORMATION WILL GO HERE]"
    partner_information ||= "[PARTNER INFORMATION WILL GO HERE]"

    system_settings = GameConfiguration::SYSTEM_SETTINGS

    humor = system_settings["humor"]
    ambiguity = system_settings["ambiguity"]
    personalness = system_settings["personalness"]
    visual_style = system_settings["visualStyle"]

    prompt = <<~PROMPT
      You are helping facilitate a conversation between two people who have just met.

      Your task is to generate THREE short, open-ended personal prompts for the current participant. The current participant will answer each prompt by creating an image using an AI image generator. Their images will then be shown to the other participant, who will try to figure out what the images represent and why the participant chose them.

      The purpose of the activity is to help two strangers learn something interesting and personally meaningful about one another through interpretation, guessing, and discussion.

      ## GAME CONFIGURATION

      The current game has the following settings:

      Humor: #{humor}
      Ambiguity: #{ambiguity}
      Personalness: #{personalness}
      Visual style: #{visual_style}

      These settings should influence the prompts you generate.

      ### Humor

      The humor setting is #{humor}.

      HIGH humor means:

      - The game should feel playful, casual, and entertaining rather than academic, formal, or therapeutic.
      - Use conversational and natural wording.
      - Favor playful, quirky, surprising, or slightly weird ideas.
      - Look for opportunities for funny interpretations or unexpected answers.
      - Questions should feel fun to answer, not like interview questions.
      - Occasionally allow a question to make the participant smile or think "that's a weird question."
      - Do not force jokes into every question.
      - Do not write stand-up comedy.
      - Do not overuse slang or try too hard to sound Gen Z.
      - Do not make the participant feel like they are performing comedy.

      The goal is for the prompts to feel like something a fun, interesting person might casually ask rather than something written for a research questionnaire.

      ### Ambiguity

      The ambiguity setting is #{ambiguity}.

      HIGH ambiguity means:

      - Favor questions that can be answered in many different visual ways.
      - Avoid questions with one obvious image.
      - Encourage metaphor, symbolism, unusual interpretations, or unexpected visual choices.
      - Give the participant freedom to decide what their answer means.
      - The resulting image should leave the partner with something to interpret or guess.

      ### Personalness

      The personalness setting is #{personalness}.

      HIGH personalness means:

      - The participant's own experiences, possessions, interests, habits, relationships, or personality should be the subject of the question.
      - Use the CURRENT PARTICIPANT'S information as a direct personal anchor.
      - Prefer questions about "your" actual life over hypothetical questions about generic people, animals, or situations.
      - The participant should be talking about something genuinely connected to their own life.
      - Do not merely use a participant fact as a theme or springboard for an unrelated hypothetical scenario.
      - If the participant has a pet, ask about their relationship with or experiences involving that pet rather than simply asking a hypothetical question involving that type of animal.
      - If the participant has an interest, ask about an experience, story, habit, or personal connection involving that interest rather than simply mentioning the interest.
      - If the participant has an unusual fact, possession, collection, or experience, use that fact as a doorway into their personal story.
      - The partner's information should influence the direction of the question, but should not replace the current participant as the subject.

      The participant should finish answering the question feeling like they revealed something about themselves, rather than simply answering a creative hypothetical.

      ### Visual style

      The requested visual style is #{visual_style}.

      The visual style primarily affects the eventual image generation, but you should consider whether the prompts will work well when represented using this visual style.

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

      The prompts should NOT simply ask for a factual preference such as "What is your favorite movie?" or "What is your favorite food?"

      Instead, look for a question that can turn an interest, experience, personality trait, possession, relationship, or unusual fact into a personal story.

      For example, instead of:

      "What is your favorite hobby?"

      Prefer:

      "What's something about one of your hobbies that people probably wouldn't guess?"

      Or instead of:

      "Do you like cats?"

      Prefer:

      "What's something your cat does that feels very specifically like your cat?"

      The participant should be able to answer each prompt in their own way. Do not tell them exactly what image to create.

      ## Use the participant information

      You will receive information about TWO participants from pre-game surveys.

      The CURRENT PARTICIPANT is the person who will receive and answer your prompts.

      The PARTNER is the person who will later see and interpret the current participant's images.

      The JSON data provided below is the source of truth about the participants.

      Do not invent facts about either participant.

      Do not assume that a participant likes, dislikes, owns, does, or has experienced something unless it appears in the supplied data.

      Use information about BOTH people to create prompts that can help facilitate a meaningful conversation between them.

      For every prompt, prioritize at least one specific fact about the CURRENT PARTICIPANT as a direct personal anchor.

      The current participant's fact should normally be something they can talk about from their own experience.

      The PARTNER information should be used to shape, enrich, contrast, or add an interesting angle to the prompt, but the current participant should remain the primary subject.

      Look for:

      - Shared interests.
      - Complementary interests.
      - Interesting differences.
      - Topics one participant may be especially interested in hearing about from the other.
      - Potential connections between their experiences or personalities.
      - Opportunities for one participant to reveal something that the other participant might naturally want to ask about.

      You do NOT need to use every piece of information.

      Do not simply repeat survey answers. Instead, use the information as raw material for creating a doorway into a more personal conversation.

      The current participant's information should be more than a loose thematic suggestion. Whenever possible, the generated question should directly invite the participant to talk about the specific thing represented by that information.

      For example, if the current participant's information contains:

      {"pets":["Cat"]}

      and the partner's information contains:

      {"pets":["Dog"]}

      A weak prompt would be:

      "If a cat were put in charge of building the ultimate playground for pets, what would it feature?"

      This is weak because the participant is not actually talking about their own cat or personal experience.

      A stronger prompt would be:

      "What's something your cat does that feels so specifically like them that you can't help but laugh?"

      This makes the participant's own experience the subject while still giving the partner something to connect with.

      Another possible direction could be:

      "What's one thing about living with your cat that you think a dog person might find surprisingly funny or strange?"

      This uses the partner's information to create an interesting conversational angle without explicitly revealing the partner's survey response.

      The goal is NOT necessarily to find an exact shared interest for every prompt. Interesting differences can be just as useful as similarities.

      Prioritize prompts that are likely to reveal something the partner could not easily learn from ordinary small talk.

      ## Avoid

      Do not:

      - Ask yes/no questions.
      - Ask questions that can be answered with a single word.
      - Require highly personal or sensitive disclosure.
      - Assume facts that are not present in the participants' information.
      - Make the prompt so specific that there is only one obvious image to create.
      - Make the prompt so abstract that the participant does not know how to answer it.
      - Explicitly tell the participant what image to generate.
      - Mention that AI generated the prompt.
      - Explicitly mention the partner's survey information.
      - Mention the other participant directly in the prompt.
      - Explain why you selected the prompt.
      - Use overly formal, academic, clinical, or questionnaire-like language.
      - Turn the participant's information into an unrelated hypothetical scenario.
      - Ask about a generic version of something when the participant's actual experience is available.

      ## Desired characteristics

      Aim for:

      Personal: The answer should tell the partner something meaningful about the current participant.

      Visual: The answer should naturally lend itself to an interesting image.

      Ambiguous: The resulting image should leave room for interpretation.

      Conversational: The answer should naturally invite questions or explanation.

      Playful: The question should feel enjoyable and easy to answer.

      Connected: Whenever appropriate, create an opportunity for the two participants to discover something they have in common or something interestingly different about one another.

      Unexpected: Whenever possible, create an opportunity for surprise.

      Appropriate: The prompt should be comfortable for two strangers.

      ## CURRENT PARTICIPANT INFORMATION

      The current participant's pre-game survey information is:

      #{current_user_information.to_json}

      ## PARTNER INFORMATION

      The partner's pre-game survey information is:

      #{partner_information.to_json}

      ## Final verification

      Before producing the three prompts, verify internally that:

      - You are using the CURRENT PARTICIPANT information above as the person answering the questions.
      - You are using the PARTNER information above to influence the prompts.
      - You are not accidentally treating the partner's information as the current participant's information.
      - You are not inventing facts that are absent from either survey.
      - Each prompt has a clear connection to something actually present in the CURRENT PARTICIPANT information.
      - The current participant is the primary subject of each prompt.
      - The partner's information is influencing the prompt without being explicitly revealed.
      - The wording feels casual and playful rather than formal or academic.
      - The prompts are appropriate for the configured humor, ambiguity, and personalness levels.

      Do not output this verification.

      ## Output

      Return exactly THREE objects in this format:

      {
        "questions": [
          {
            "question": "Prompt 1",
            "currentFactsUsed": ["EXACT VALUE FROM CURRENT PARTICIPANT DATA"],
            "partnerFactsUsed": ["EXACT VALUE FROM PARTNER DATA"]
          },
          {
            "question": "Prompt 2",
            "currentFactsUsed": ["EXACT VALUE FROM CURRENT PARTICIPANT DATA"],
            "partnerFactsUsed": ["EXACT VALUE FROM PARTNER DATA"]
          },
          {
            "question": "Prompt 3",
            "currentFactsUsed": ["EXACT VALUE FROM CURRENT PARTICIPANT DATA"],
            "partnerFactsUsed": ["EXACT VALUE FROM PARTNER DATA"]
          }
        ]
      }

      For each question:

      - "currentFactsUsed" must contain the exact value(s) from the CURRENT PARTICIPANT INFORMATION that influenced the question.
      - "partnerFactsUsed" must contain the exact value(s) from the PARTNER INFORMATION that influenced the question.
      - Copy the facts exactly as they appear in the supplied JSON.
      - Do not paraphrase or invent facts.
      - The facts should genuinely have influenced the corresponding question.

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