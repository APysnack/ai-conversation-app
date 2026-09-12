import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthRoute = ({ element }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? element : <Navigate to="/members" replace />;
};

export default AuthRoute;
