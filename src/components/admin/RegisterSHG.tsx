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
  contact: string;
  name: string;
  location: string;
  block: string;
  cluster: string;
}
const RegisterShg = () => {
  const [status, setStatus] = useState('');
  const [zones, setZones] = useState<string[]>([]);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [block, setBlock] = useState<string>('');
  const [cluster, setCluster] = useState<string>('');
  const [clusteroptions, setClusteroptions] = useState<any>([]);
  const [helperTexts, setHelperTexts] = useState<HelperTextType>({
    name: '',
    location: '',
    contact: '',
    block: '',
    cluster: '',
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
    if (user.token) {
      dispatch(fetchAllShgData(user.token));
    }
    getallzones();
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
        'https://backend.cgshgmart.com/shg/register',
        requestOptions
      );
      if (response.status !== 200) {
        setStatus('failed');
        throw Error('An error occurred');
      }
      setStatus('succeeded');
      setName('');
      setLocation('');
      setContact('');
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
      setHelperTexts((prev) => ({ ...prev, location: 'Location is required' }));
    else if (!contact)
      setHelperTexts((prev) => ({ ...prev, contact: 'Contact is required' }));
    else if (contact.length !== 10)
      setHelperTexts((prev) => ({
        ...prev,
        contact: 'Contact length should be 10',
      }));
    else if (!block)
      setHelperTexts((prev) => ({ ...prev, zone: 'Zone is required' }));
    else if (!cluster)
      setHelperTexts((prev) => ({ ...prev, cluster: 'Cluster is required' }));
    else register({ name, location, contact, block, cluster });
  };
  const blockoptions: Array<any> = [
    {
      id: 1,
      name: 'अभनपुर',
    },
    {
      id: 2,
      name: 'आरंग',
    },
    {
      id: 3,
      name: 'तिल्दा',
    },
    {
      id: 4,
      name: 'धरसींवा',
    },
  ];
  const handleclusteroptions = (block: string) => {
    if (block === 'अभनपुर') {
      setClusteroptions([
        {
          id: 1,
          name: 'उन्नति क्लस्टर संगठन पोंड',
        },
        {
          id: 2,
          name: 'आदर्श क्लस्टर संगठन मानिकचौरी',
        },
        {
          id: 3,
          name: 'चंचल क्लस्टर संगठन खोरपा',
        },
        {
          id: 4,
          name: 'प्रगति क्लस्टर संगठन केन्द्री',
        },
      ]);
    } else if (block === 'आरंग') {
      setClusteroptions([
        {
          id: 1,
          name: 'संगम क्लस्टर संगठन रसनि',
        },
        {
          id: 2,
          name: 'आशा क्लस्टर संगठन चंदखुरी',
        },
        {
          id: 3,
          name: 'अमृत क्लस्टर संगठन गुल्लू',
        },
        {
          id: 4,
          name: 'ख़ुशी क्लस्टर संगठन भैंसा',
        },
      ]);
    } else if (block === 'तिल्दा') {
      setClusteroptions([
        {
          id: 1,
          name: 'छग महतारी क्लस्टर संगठन बंगोली',
        },
        {
          id: 2,
          name: 'आराधना क्लस्टर संगठन कोटा',
        },
        {
          id: 3,
          name: 'नारि शक्ति क्लस्टर संगठन बेलदारसिवनी',
        },
        {
          id: 4,
          name: 'भूमि महिला क्लस्टर संगठन सांकरा',
        },
      ]);
    } else if (block === 'धरसींवा') {
      setClusteroptions([
        {
          id: 1,
          name: 'लक्ष्य महिला क्लस्टर माना',
        },
        {
          id: 2,
          name: 'शक्ति क्लस्टर सगठन सिलयारी',
        },
        {
          id: 3,
          name: 'ज्ञानदीप क्लस्टर संगठन धरसींवा',
        },
        {
          id: 4,
          name: 'वीणा क्लस्टर संगठन मांढर',
        },
      ]);
    }
    setCluster('');
  };

  return (
    <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
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
            onChange={(e) => handleContact(e.target.value)}
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
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            value={location}
            label="Location"
            onChange={(e) => setLocation(e.target.value)}
          >
            {zones.map((zone: any) => (
              <MenuItem value={zone.zonename}>
                {zone.zonename.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="location-label">Block</InputLabel>
          <Select
            labelId="location-label"
            value={block}
            label="Location"
            onChange={(e) => {
              setBlock(e.target.value);
              handleclusteroptions(e.target.value);
            }}
          >
            {blockoptions.map((block: any) => (
              <MenuItem value={block.name}>{block.name.toUpperCase()}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="location-label">Cluster</InputLabel>
          <Select
            labelId="location-label"
            value={cluster}
            label="Location"
            onChange={(e) => setCluster(e.target.value)}
          >
            {clusteroptions.map((clusterd: any) => (
              <MenuItem value={clusterd.name}>
                {clusterd.name.toUpperCase()}
              </MenuItem>
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

export default RegisterShg;
