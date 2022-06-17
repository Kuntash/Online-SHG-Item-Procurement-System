import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  ContainerColumnBox,
  StyledButton,
  StyledPaper,
  StyledTextField,
} from '../../components/custom';
import { handleOpenSnackbar } from '../utilityStates/utilitySlice';
import { login, selectUser } from './authSlice';

interface HelperTextType {
  email: string;
  password: string;
}
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
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
  useEffect(() => {
    if (user.status === 'loading') console.log('Loading user info');
    if (user.status === 'succeeded') {
      if (user.userType === 'department')
        navigate('/dashboard/department/approve-orders');
      if (user.userType === 'institute')
        navigate('/dashboard/institute/all-orders');
      if (user.userType === 'ceo') navigate('/dashboard/admin/view-all-shgs');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user.status === 'loading')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Logging in',
          snackbarType: 'info',
        })
      );
    if (user.status === 'failed')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Error while logging in',
          snackbarType: 'error',
        })
      );
    if (user.status === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Successfully logged in',
          snackbarType: 'success',
        })
      );
  }, [user.status, dispatch]);
  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!inputEmail)
      setHelperTexts((prev) => ({ ...prev, email: 'Email is required' }));

    if (!inputPassword)
      setHelperTexts((prev) => ({ ...prev, password: 'Password is required' }));
    if (!inputPassword || !inputPassword) return;

    dispatch(login({ email: inputEmail, password: inputPassword }));
  };
  return (
    <StyledPaper sx={{ width: '90%' }}>
      <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
        <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h2">Welcome</Typography>
          <Typography
            variant="body1"
            color="secondary.dark"
          >
            Enter your details below
          </Typography>
        </ContainerColumnBox>
        <form onSubmit={(e) => handleLogin(e)}>
          <FormControl sx={{ width: '100%', marginBottom: '20px' }}>
            <StyledTextField
              helperText={helperTexts.email}
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              sx={{ borderRadius: '0.8rem', width: '100%' }}
              label="Email address"
              variant="outlined"
              type="email"
            />
          </FormControl>
          <FormControl sx={{ width: '100%', marginBottom: '20px' }}>
            <StyledTextField
              helperText={helperTexts.password}
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              label="Password"
              sx={{ borderRadius: '0.8rem', width: '100%' }}
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
            startIcon={
              user.status === 'loading' ? (
                <CircularProgress sx={{ color: 'white' }} />
              ) : null
            }
            variant="contained"
            color="primary"
            sx={{
              padding: '0.75rem 1.2rem',
              width: '100%',
              marginBottom: '20px',
            }}
            type="submit"
          >
            Login
          </StyledButton>
        </form>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default LoginForm;
