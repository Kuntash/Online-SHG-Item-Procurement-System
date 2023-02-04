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
  itemname: string;
  itemunit: string;
}
const AddItem = () => {
  const [status, setStatus] = useState('');
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [itemname, setItemName] = useState<string>('');
  const [itemunit, setItemUnit] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [helperTexts, setHelperTexts] = useState<HelperTextType>({
    itemname: '',
    itemunit: '',
  });

  useEffect(() => {
    if (status === 'loading')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Please Wait',
          snackbarType: 'info',
        })
      );
    if (status === 'failed') {
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: error
            ? error
            : 'Error while Adding Item ,Please try again',
          snackbarType: 'error',
        })
      );
      setError('');
    }
    if (status === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Item Added Successfully',
          snackbarType: 'success',
        })
      );
    if (user.token) {
      dispatch(fetchAllShgData(user.token));
    }
  }, [status, dispatch]);

  const register = async (data: HelperTextType) => {
    if (status === 'loading') return;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('authorization', `Bearer ${user.token}`);
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
        'https://backend.cgshgmart.com/order/additem',
        requestOptions
      );
      if (response.status !== 200) {
        const error = await response.json();
        if (error?.error) {
          setError(error.error);
        }
        throw Error('An error occurred');
      }
      setStatus('succeeded');
      setItemName('');
      setItemUnit('');
      return;
    } catch (error: any) {
      setStatus('failed');
      return;
    }
  };

  const handleRegister = async () => {
    if (!itemname)
      setHelperTexts((prev) => ({ ...prev, name: 'Item Name is required' }));
    else if (!itemunit)
      setHelperTexts((prev) => ({
        ...prev,
        location: 'Item unit is required',
      }));
    else register({ itemname, itemunit });
  };
  return (
    <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
      <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
        <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h2">Add New Item</Typography>
          <Typography
            variant="body1"
            color="secondary.dark"
          >
            कृपया प्रोडक्ट का नाम हिंदी में टाइप करने के लिए{' '}
            <a
              href="https://www.google.com/inputtools/try/"
              target="_blank"
              rel="noreferrer"
            >
              गूगल इनपुट टूल्स
            </a>{' '}
            का प्रयोग करे
          </Typography>
        </ContainerColumnBox>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.itemname}
            value={itemname}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Item Name"
            variant="outlined"
            type="text"
          />
        </FormControl>
        <FormControl>
          <InputLabel id="itemunit-label">Item Unit</InputLabel>
          <Select
            labelId="itemunit-label"
            value={itemunit}
            label="Item Unit"
            onChange={(e) => setItemUnit(e.target.value)}
          >
            <MenuItem value={'Kg'}>Kg</MenuItem>
            <MenuItem value={'Dozen'}>Dozen</MenuItem>
            <MenuItem value={'Gram'}>Gram</MenuItem>
            <MenuItem value={'Litre'}>Litre</MenuItem>
            <MenuItem value={'Millilitre'}>Millilitre</MenuItem>
            <MenuItem value={'Piece'}>Piece</MenuItem>
          </Select>
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
          Add
        </StyledButton>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default AddItem;
