import {
  FormControl,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  IconButton,
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
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface HelperTextType {
  username: string;
  password: string;
  contact: string;
  name: string;
  location: string;
  blockid: string;
}
const AddBlockAdmin = () => {
  const [status, setStatus] = useState('');
  const [zones, setZones] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [block, setBlock] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [blocks, setBlocks] = useState<any>([]);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);
  const [helperTexts, setHelperTexts] = useState<HelperTextType>({
    name: '',
    location: '',
    contact: '',
    username: '',
    password: '',
    blockid: '',
  });
  const handleContact = (cont: string) => {
    const reg = /\d+$/;
    if (cont.match(reg) || cont == '' || cont === '') setContact(cont);
    return;
  };
  const getallzones = async () => {
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow',
    };
    try {
      const response = await fetch(
        'https://backend.cgshgmart.com/shg/getallzones',
        requestOptions
      );
      const result = await response.json();
      setZones(result.zones);
    } catch (err) {
      console.log(err);
    }
  };
  const getallblocks = async () => {
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(
      'https://backend.cgshgmart.com/ceo/getblocks',
      requestOptions
    );
    const result = await response.json();
    setBlocks(result.blocks);
  };
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
            : 'Error while Registering ,Please try again',
          snackbarType: 'error',
        })
      );
      setError('');
    }
    if (status === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Admin Registered Successfully',
          snackbarType: 'success',
        })
      );
    if (user.token) {
      dispatch(fetchAllShgData(user.token));
    }
    getallzones();
    getallblocks();
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
        'https://backend.cgshgmart.com/ceo/addblockadmin',
        requestOptions
      );
      if (response.status !== 200) {
        const error = await response.json();
        if (error?.message) setError(error.message);
        throw Error('An error occurred');
      }
      setStatus('succeeded');
      setName('');
      setLocation('');
      setContact('');
      setUsername('');
      setPassword('');
      setBlock('');
      return;
    } catch (error: any) {
      setStatus('failed');
      return;
    }
  };

  const handleRegister = async () => {
    if (!name)
      setHelperTexts((prev) => ({ ...prev, name: 'SHG Name is required' }));
    else if (!location)
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Select Location',
          snackbarType: 'error',
        })
      );
    else if (!contact)
      setHelperTexts((prev) => ({ ...prev, contact: 'Contact is required' }));
    else if (contact.length !== 10)
      setHelperTexts((prev) => ({
        ...prev,
        contact: 'Contact length should be 10',
      }));
    else if (!username)
      setHelperTexts((prev) => ({ ...prev, username: 'Username is required' }));
    else if (!password)
      setHelperTexts((prev) => ({ ...prev, password: 'Password is required' }));
    else if (!block)
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Select Block',
          snackbarType: 'error',
        })
      );
    else {
      const data = {
        name,
        location,
        contact,
        username,
        password,
        blockid: block,
      };
      register(data);
    }
  };
  const handleClickShowPassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  return (
    <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
      <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
        <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h2">Register New Block Admin</Typography>
          <Typography
            variant="body1"
            color="secondary.dark"
          >
            Enter Admin details below
          </Typography>
        </ContainerColumnBox>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Name"
            variant="outlined"
            type="text"
          />
        </FormControl>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.username}
            value={username}
            onChange={(e) => {
              if (e.target.value.includes(' ')) {
                dispatch(
                  handleOpenSnackbar({
                    snackbarMessage: 'Spaces are not allowed in username',
                    snackbarType: 'error',
                  })
                );
                return;
              }
              setUsername(e.target.value);
            }}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Username"
            variant="outlined"
            type="text"
          />
        </FormControl>
        <FormControl sx={{ width: '100%', margin: '10px 0' }}>
          <StyledTextField
            helperText={helperTexts.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Password"
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
        <FormControl>
          <StyledTextField
            helperText={helperTexts.contact}
            value={contact}
            onChange={(e) => handleContact(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Contact"
            variant="outlined"
            type="text"
          />
        </FormControl>

        <FormControl>
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            value={location}
            label="Location"
            onChange={(e) => setLocation(e.target.value)}
          >
            {zones?.map((zone: any) => (
              <MenuItem value={zone.zonename}>
                {zone.zonename.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="block-label">Block</InputLabel>
          <Select
            labelId="block-label"
            value={block}
            label="Block"
            onChange={(e) => setBlock(e.target.value)}
          >
            {blocks?.map((block: any) => (
              <MenuItem value={block._id}>{block.blockname}</MenuItem>
            ))}
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
          Register
        </StyledButton>
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default AddBlockAdmin;
