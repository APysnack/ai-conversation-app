# Rack::Attack configuration for rate limiting

class Rack::Attack
  # Configure cache backend
  # Use Rails cache (which defaults to memory store in development)
  cache.store = ActiveSupport::Cache::MemoryStore.new

  # Throttle GraphQL sign-in attempts per IP
  # Max 5 requests per minute per IP
  throttle('graphql/sign_in/ip', limit: 5, period: 60) do |req|
    if req.path == '/graphql' && req.post?
      # Check if this is a sign-in mutation
      body = req.body.read
      req.body.rewind
      
      if body.include?('signIn') || body.include?('mutation SignIn')
        req.ip
      end
    end
  end

  # Throttle GraphQL sign-up attempts per IP
  # Max 3 requests per minute per IP
  throttle('graphql/sign_up/ip', limit: 3, period: 60) do |req|
    if req.path == '/graphql' && req.post?
      body = req.body.read
      req.body.rewind
      
      if body.include?('signUp') || body.include?('mutation SignUp')
        req.ip
      end
    end
  end

  # Custom response for rate limited requests
  self.throttled_responder = lambda { |env|
    [429, { 'Content-Type' => 'application/json' }, 
     [{ error: 'Too many requests. Please try again later.' }.to_json]]
  }
end
