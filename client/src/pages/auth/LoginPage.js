import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SignupForm from './SignupForm/SignupForm';
import LoginForm from './LoginForm';

const LoginPage = () => {
  const location = useLocation();
  const [showSignup, setShowSignup] = useState(location.pathname === '/register');

  return <>{showSignup ? <SignupForm /> : <LoginForm />}</>;
};

export default LoginPage;
