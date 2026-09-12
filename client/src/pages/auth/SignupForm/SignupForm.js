import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../../../store/thunks';
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
} from '../forms/FormElements';

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [validationError, setValidationError] = useState('');

  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (password !== passwordConfirmation) {
      setValidationError('Passwords do not match');
      return;
    }

    const result = await dispatch(signUpUser({ email, password, passwordConfirmation }));

    if (signUpUser.fulfilled.match(result)) {
      navigate('/members');
    }
  };

  const displayError = validationError || error;

  return (
    <Container>
      <Card>
        <Title>Create Account</Title>
        <Subtitle>Join us today</Subtitle>

        {displayError && <Alert>{displayError}</Alert>}

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

          <FormGroup>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              disabled={loading}
            />
          </FormGroup>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </PrimaryButton>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <SecondaryButton type="button" onClick={() => navigate('/login')} disabled={loading}>
          Already registered? Log in here
        </SecondaryButton>
      </Card>
    </Container>
  );
};

export default SignupForm;
