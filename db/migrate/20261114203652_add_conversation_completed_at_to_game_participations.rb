class AddConversationCompletedAtToGameParticipations < ActiveRecord::Migration[7.1]
  def change
    add_column :game_participations, :conversation_completed_at, :datetime
  end
end
