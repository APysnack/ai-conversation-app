class GameParticipation < ApplicationRecord
  belongs_to :game_session
  belongs_to :user

  validates :user_id,
            uniqueness: { scope: :game_session_id }

  validate :user_must_belong_to_game_session

  private

  def user_must_belong_to_game_session
    return unless game_session && user

    participant_ids = [
      game_session.user_one_id,
      game_session.user_two_id
    ]

    unless participant_ids.include?(user_id)
      errors.add(
        :user,
        "must be one of the participants in this game session"
      )
    end
  end
end