import { useEffect, useState } from 'react';
import {
  ContainerColumnBox,
  StyledButton,
  StyledPaper,
  StyledTextField,
} from '../custom';
import {
  FormControl,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { selectUser } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { handleOpenSnackbar } from '../../features/utilityStates/utilitySlice';
interface passwordtype {
  password: string;
  confirmpassword: string;
  oldpassword: string;
}
const ChangePassword = () => {
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState('');
  const [oldpassword, setOldPassword] = useState<string>('');
  const [confirmpassword, setConfirmpassword] = useState<string>('');
  const [showPassword1, setShowPassword1] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);
  const [showPassword3, setShowPassword3] = useState<boolean>(false);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [passwordtext, setpasswordtext] = useState<passwordtype>({
    password: '',
    confirmpassword: '',
    oldpassword: '',
  });
  const handleClickShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };
  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  const handleClickShowPassword3 = () => {
    setShowPassword3(!showPassword3);
  };
  const handleChange = async (e: any) => {
    e.preventDefault();
    if (!oldpassword) {
      setpasswordtext({
        oldpassword: 'Please enter old password',
        password: '',
        confirmpassword: '',
      });
      return;
    }
    if (!password) {
      setpasswordtext({
        password: 'Please enter password',
        oldpassword: '',
        confirmpassword: '',
      });
      return;
    }
    if (!confirmpassword) {
      setpasswordtext({
        confirmpassword: 'Please enter confirm password',
        oldpassword: '',
        password: '',
      });
      return;
    }
    if (password !== confirmpassword) {
      setpasswordtext({
        oldpassword: '',
        password: '',
        confirmpassword: 'Password does not match',
      });
      return;
    }
    setpasswordtext({
      confirmpassword: '',
      oldpassword: '',
      password: '',
    });
    if (status === 'loading') return;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('authorization', `Bearer ${user.token}`);
    const raw = JSON.stringify({
      oldpassword: btoa(oldpassword),
      newpassword: btoa(password),
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      body: raw,
      redirect: 'follow',
    };
    setStatus('loading');
    try {
      const response = await fetch(
        'https://selfhelpgroup-backend.herokuapp.com/department/changepassword',
        requestOptions
      );
      if (response.status !== 200) {
        setStatus('failed');
        throw Error('An error occurred');
      }
      setStatus('succeeded');
      setOldPassword('');
      setPassword('');
      setConfirmpassword('');
      return;
    } catch (error: any) {
      setStatus('failed');
      return;
    }
  };
  useEffect(() => {
    if (status === 'loading')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Please Wait',
          snackbarType: 'info',
        })
      );
    if (status === 'failed')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Error! Please try again',
          snackbarType: 'error',
        })
      );
    if (status === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Password Changed Successfully',
          snackbarType: 'success',
        })
      );
  }, [status, dispatch]);
  return (
    <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
      <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
        <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h2">Change Password</Typography>
          <Typography
            variant="body1"
            color="secondary.dark"
          >
            Enter New Password
          </Typography>
        </ContainerColumnBox>
        <form onSubmit={handleChange}>
          <FormControl sx={{ width: '100%', margin: '10px 0' }}>
            <StyledTextField
              helperText={passwordtext.oldpassword}
              value={oldpassword}
              onChange={(e) => setOldPassword(e.target.value)}
              sx={{ borderRadius: '0.8rem', width: '100%' }}
              label="Old Password"
              variant="outlined"
              type={showPassword1 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword1}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword1 ? (
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
          <FormControl sx={{ width: '100%', margin: '10px 0' }}>
            <StyledTextField
              helperText={passwordtext.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ borderRadius: '0.8rem', width: '100%' }}
              label="New Password"
              variant="outlined"
              type={showPassword2 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword2}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword2 ? (
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
          <FormControl sx={{ width: '100%', margin: '10px 0' }}>
            <StyledTextField
              helperText={passwordtext.confirmpassword}
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              sx={{ borderRadius: '0.8rem', width: '100%' }}
              label="Confirm New Password"
              variant="outlined"
              type={showPassword3 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword3}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword3 ? (
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
              status === 'loading' ? (
                <CircularProgress sx={{ color: 'white' }} />
              ) : null
            }
            variant="contained"
            color="primary"
            sx={{ padding: '0.75rem 1.2rem', width: '100%', margin: '10px 0' }}
            type="submit"
          >
            Change Password
          </StyledButton>
        </form>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default ChangePassword;
