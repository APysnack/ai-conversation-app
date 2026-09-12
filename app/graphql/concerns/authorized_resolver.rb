module AuthorizedResolver
  extend ActiveSupport::Concern

  private

  def current_user
    context[:current_user]
  end

  def ensure_authenticated!
    raise GraphQL::ExecutionError, "Not authenticated" unless current_user
    current_user
  end

  def authorize_admin!
    ensure_authenticated!
    raise GraphQL::ExecutionError, "Not authorized" unless current_user.has_role?(:admin)
    current_user
  end

  def authorize_member!
    ensure_authenticated!
    raise GraphQL::ExecutionError, "Not authorized" unless current_user.has_role?(:member)
    current_user
  end

  def authorize_admin_or_member!
    ensure_authenticated!
    raise GraphQL::ExecutionError, "Not authorized" unless current_user.has_role?(:admin) || current_user.has_role?(:member)
    current_user
  end
end
