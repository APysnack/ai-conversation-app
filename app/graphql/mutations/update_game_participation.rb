module Mutations
  class UpdateGameParticipation < GraphQL::Schema::Mutation
    field :success, Boolean, null: false
    field :message, String, null: false

    field :participation,
          Types::Models::GameParticipationType,
          null: true

    argument :participation_id, ID, required: true

    argument :preparation_data,
             GraphQL::Types::JSON,
             required: false

    argument :post_game_survey,
             GraphQL::Types::JSON,
             required: false

    argument :conversation_completed,
             Boolean,
             required: false

    def resolve(
      participation_id:,
      preparation_data: nil,
      post_game_survey: nil,
      conversation_completed: nil
    )
      user = context[:current_user]

      unless user
        return {
          success: false,
          message: "You must be logged in.",
          participation: nil
        }
      end

      if preparation_data.nil? &&
         post_game_survey.nil? &&
         conversation_completed.nil?
        return {
          success: false,
          message: "No data was provided to update.",
          participation: nil
        }
      end

      participation = user.game_participations.find_by(
        id: participation_id
      )

      unless participation
        return {
          success: false,
          message: "Participation not found.",
          participation: nil
        }
      end

      attributes = {}

      unless preparation_data.nil?
        attributes[:preparation_data] = preparation_data
      end

      unless post_game_survey.nil?
        attributes[:post_game_survey] = post_game_survey
      end

      unless conversation_completed.nil?
        attributes[:conversation_completed_at] =
          conversation_completed ? (participation.conversation_completed_at || Time.current) : nil
      end

      if participation.update(attributes)
        {
          success: true,
          message: "Participation updated successfully.",
          participation: participation
        }
      else
        {
          success: false,
          message: participation.errors.full_messages.join(", "),
          participation: nil
        }
      end
    end
  end
end