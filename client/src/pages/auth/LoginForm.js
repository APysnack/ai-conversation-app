import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser } from '../../store/thunks';
import {
  Container,
  Card,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Input,
  PrimaryButton,
  SecondaryButton,
  Divider,
  Alert,
} from './forms/FormElements';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(signInUser({ email, password }));

    if (signInUser.fulfilled.match(result)) {
      navigate('/members');
    }
  };

  return (
    <Container>
      <Card>
        <Title>Welcome Back</Title>
        <Subtitle>Log in to your account</Subtitle>

        {error && <Alert>{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Log In'}
          </PrimaryButton>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <SecondaryButton type="button" onClick={() => navigate('/register')} disabled={loading}>
          Don't have an account? Sign up here
        </SecondaryButton>
      </Card>
    </Container>
  );
};

export default LoginForm;
