import {
  FormControl,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  ContainerColumnBox,
  StyledButton,
  StyledPaper,
  StyledTextField,
} from '../custom';
import { handleOpenSnackbar } from '../../features/utilityStates/utilitySlice';
import { selectUser } from '../../features/auth/authSlice';
import { fetchAllShgData } from '../../features/adminData/adminDataSlice';

interface HelperTextType {
  title: string;
}
const NewAnnouncement = () => {
  const [status, setStatus] = useState('');
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>('');
  const [helperTexts, setHelperTexts] = useState<HelperTextType>({
    title: '',
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
          snackbarMessage: 'Error while Adding Location ,Please try again',
          snackbarType: 'error',
        })
      );
    if (status === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Announcement Added Successfully',
          snackbarType: 'success',
        })
      );
    if (user.token) {
      dispatch(fetchAllShgData(user.token));
    }
  }, [status, dispatch]);
  const AddAnnouncement = async (title: string) => {
    setStatus('loading');
    const requestOptions: RequestInit = {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ title }),
    };

    try {
      const response = await fetch(
        'https://backend.cgshgmart.com/ceo/addannouncement',
        requestOptions
      );

      const result = await response.json();
      if (result.success) {
        setStatus('succeeded');
        setTitle('');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      setStatus('failed');
    }
  };

  const handleRegister = async () => {
    if (!title)
      setHelperTexts((prev) => ({
        ...prev,
        location: 'Title is required',
      }));
    AddAnnouncement(title);
  };
  return (
    <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
      <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
        <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h2">Add New Announcement</Typography>
        </ContainerColumnBox>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Title"
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
          Submit
        </StyledButton>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default NewAnnouncement;
