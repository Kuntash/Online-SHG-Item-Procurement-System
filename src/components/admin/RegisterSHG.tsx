import {
  FormControl,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch,useAppSelector } from '../../app/hooks';
import {
  ContainerColumnBox,
  StyledButton,
  StyledPaper,
  StyledTextField,
} from '../custom';
import { handleOpenSnackbar } from '../../features/utilityStates/utilitySlice';
import { selectUser } from '../../features/auth/authSlice';



interface HelperTextType {
  contact: string;
  name: string;
  location: string;
}
const RegisterShg = () => {
  const [status,setStatus] = useState('');
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [helperTexts, setHelperTexts] = useState<HelperTextType>({
    name: '',
    location: '',
    contact: '',
  });

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
          snackbarMessage: 'Error while Registering ,Please try again',
          snackbarType: 'error',
        })
      );
    if (status === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'SHG Registered Successfully',
          snackbarType: 'success',
        })
      );
  }, [status, dispatch]);

const register = async (data:HelperTextType) => {
  if(status === 'loading') return;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append("authorization",`Bearer ${user.token}`)
  const raw = JSON.stringify(data);

  const requestOptions: RequestInit = {
    method: 'POST',
    headers,
    body: raw,
    redirect: 'follow',
  };
  setStatus('loading');
  try {
    const response = await fetch(
      'https://selfhelpgroup-backend.herokuapp.com/shg/register',
      requestOptions
    );
    if (response.status !== 200){
      setStatus("failed");
      throw Error('An error occurred');
    }
    setStatus("succeeded");
    setName('');
    setLocation('');
    setContact('');
    return;
  } catch (error: any) {
    setStatus("failed");
    return;
  }
}

  const handleRegister = async () => {
    if (!name)
      setHelperTexts((prev) => ({ ...prev, name: 'SHG Name is required' }));
    else if (!location)
      setHelperTexts((prev) => ({ ...prev, location: 'Location is required' }));
    else if (!contact)
      setHelperTexts((prev) => ({ ...prev, contact: 'Contact is required' }));
    else
    register({name,location,contact});
  };
  return (
    <StyledPaper sx={{ width: '60%',margin: 'auto' }}>
      <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
        <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h2">Register New Shg</Typography>
          <Typography
            variant="body1"
            color="secondary.dark"
          >
            Enter SHG details below
          </Typography>
        </ContainerColumnBox>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.contact}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Contact"
            variant="outlined"
            type="text"
          />
        </FormControl>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="SHG Name"
            variant="outlined"
            type="text"
          />
        </FormControl>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.location}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Location"
            variant="outlined"
            type="text"
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
          sx={{ padding: '0.75rem 1.2rem' }}
          type="submit"
          onClick={handleRegister}
        >
          Register
        </StyledButton>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default RegisterShg;
