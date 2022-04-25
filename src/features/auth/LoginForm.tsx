import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ContainerColumnBox,
  StyledButton,
  StyledPaper,
  StyledTextField,
} from '../../components/custom';

interface HelperTextType {
  email: string;
  password: string;
}
const LoginForm = () => {
  const navigate = useNavigate();
  const [inputEmail, setInputEmail] = useState<string>('');
  const [helperTexts, setHelperTexts] = useState<HelperTextType>({
    email: '',
    password: '',
  });
  const [inputPassword, setInputPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (!inputEmail)
      setHelperTexts((prev) => ({ ...prev, email: 'Email is required' }));

    if (!inputPassword)
      setHelperTexts((prev) => ({ ...prev, password: 'Password is required' }));
    if (!inputPassword || !inputPassword) return;
    navigate('/dashboard/all-orders');
  };
  return (
    <StyledPaper>
      <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
        <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h2">Login Form</Typography>
          <Typography
            variant="body1"
            color="secondary.dark"
          >
            Enter your details below
          </Typography>
        </ContainerColumnBox>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.email}
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            sx={{ borderRadius: '0.8rem' }}
            label="Email address"
            variant="outlined"
            type="email"
          />
        </FormControl>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.password}
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff color="secondary" />
                    ) : (
                      <Visibility color="secondary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <StyledButton
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleLogin}
          sx={{ padding: '0.75rem 1.2rem' }}
        >
          Login
        </StyledButton>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default LoginForm;
