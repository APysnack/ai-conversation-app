class GraphqlController < ApplicationController
  def execute
    # Apollo Client sends variables as a Hash-like object
    # We need to permit GraphQL variables through strong parameters
    permitted_params = params.permit(:query, :operationName, 
                                 variables: {}, 
                                 extensions: {},
                                 graphql: [:query, :operationName, { variables: {} }, { extensions: {} }])
    query = permitted_params[:query]
    operation_name = permitted_params[:operationName]
    variables = permitted_params[:variables]&.to_h || {}

    context = {
      current_user: current_user,
      cookies: cookies
    }

    result = InfrastructureSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    
    # Handle auth token from mutations
    if context[:auth_token]
      cookies.encrypted[:_auth_token] = {
        value: context[:auth_token],
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        expires: 3.months.from_now
      }
    end
    
    # Handle logout from mutations
    if context[:should_clear_auth]
      cookies.delete(:_auth_token, 
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax
      )
    end
    
    render json: result
  rescue StandardError => e
    handle_error_in_development(e)
  end

  private

  def handle_error_in_development(error)
    if Rails.env.development?
      render json: { errors: [{ message: error.message, backtrace: error.backtrace }] }, status: 500
    else
      render json: { errors: [{ message: "Internal server error" }] }, status: 500
    end
  end

  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      JSON.parse(ambiguous_param) rescue {}
    when Hash
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end
end
