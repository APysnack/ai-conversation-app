import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ element }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
