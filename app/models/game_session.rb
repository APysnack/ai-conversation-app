
class GameSession < ApplicationRecord
  belongs_to :user_one, class_name: "User"
  belongs_to :user_two, class_name: "User"

  has_many :game_participations, dependent: :restrict_with_error

  CONDITIONS = %w[control ai_mediated].freeze
  STATUSES = %w[pending ready in_progress completed].freeze

  validates :condition, inclusion: { in: CONDITIONS }
  validates :status, inclusion: { in: STATUSES }

  validate :participants_must_be_different
  validate :participants_must_not_have_another_session_with_same_condition
  validate :participants_must_not_have_met_each_other

  after_create :create_participations

  private

  def participants_must_be_different
    return unless user_one_id.present? && user_two_id.present?

    if user_one_id == user_two_id
      errors.add(:user_two, "must be different from the first participant")
    end
  end

  def participants_must_not_have_another_session_with_same_condition
    return unless user_one_id.present? && user_two_id.present?
    return unless CONDITIONS.include?(condition)

    [user_one, user_two].each do |participant|
      existing_session = GameSession
        .where(condition: condition)
        .where(
          "user_one_id = :id OR user_two_id = :id",
          id: participant.id
        )
        .where.not(id: id)
        .exists?

      if existing_session
        errors.add(
          :base,
          "#{participant.email} already has a #{condition.humanize} session"
        )
      end
    end
  end

  def participants_must_not_have_met_each_other
    return unless user_one_id.present? && user_two_id.present?

    existing_session = GameSession
      .where(
        "(user_one_id = :one AND user_two_id = :two) OR " \
        "(user_one_id = :two AND user_two_id = :one)",
        one: user_one_id,
        two: user_two_id
      )
      .where.not(id: id)
      .exists?

    if existing_session
      errors.add(
        :base,
        "These participants have already been assigned to a session together"
      )
    end
  end

  def create_participations
    game_participations.create!(
      user: user_one,
      preparation_data: {},
      generated_images: [],
      post_game_survey: {}
    )

    game_participations.create!(
      user: user_two,
      preparation_data: {},
      generated_images: [],
      post_game_survey: {}
    )
  end
end
