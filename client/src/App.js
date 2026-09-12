import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { fetchCurrentUser } from './store/thunks';
import LoginForm from './pages/auth/LoginForm';
import SignupForm from './pages/auth/SignupForm/SignupForm';
import UserDashboard from './pages/auth/UserDashboard/UserDashboard';
import ProtectedRoute from './pages/auth/ProtectedRoute';
import SettingsPage from './pages/SettingsPage';
import Header from './components/Header';
import AuthRoute from './pages/auth/AuthRoute';
import Game from './pages/experiment/Game';
import PostGameSurvey from './pages/experiment/PostGameSurvey';
import PreGameSurvey from './pages/experiment/PreGameSurvey';

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SettingsProvider>
      <ThemeProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/login" element={<AuthRoute element={<LoginForm />} />} />
            <Route path="/register" element={<AuthRoute element={<SignupForm />} />} />
            <Route path="/members" element={<ProtectedRoute element={<UserDashboard />} />} />
            <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/game" element={<ProtectedRoute element={<Game />} />} />
            <Route path="/pregame" element={<ProtectedRoute element={<PreGameSurvey />} />} />
            <Route path="/postgame" element={<ProtectedRoute element={<PostGameSurvey />} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
