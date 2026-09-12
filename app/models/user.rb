class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  rolify
  
  devise :database_authenticatable, :registerable,
         :validatable, :jwt_authenticatable, jwt_revocation_strategy: self


  after_create :assign_default_role

  # Returns true when update succeeds, false otherwise.
  def update_settings(new_settings)
    new_settings_hash = new_settings.respond_to?(:to_h) ? new_settings.to_h : new_settings
    merged = (settings || {}).deep_merge(new_settings_hash)
    update(settings: merged)
  end

  private

  def assign_default_role
    self.add_role(:member) if self.roles.blank?
  end
end
