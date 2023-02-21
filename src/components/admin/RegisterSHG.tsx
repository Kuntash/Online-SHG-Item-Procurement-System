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
import { useLocation, useNavigate } from 'react-router-dom';
import Loading2 from '../utility/Loading2';
interface HelperTextType {
  contact: string;
  name: string;
  location: string;
  block: string;
  cluster: string;
  village: string;
}
const RegisterShg = () => {
  const urllocation = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [zones, setZones] = useState<string[]>([]);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [shgid, setShgId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [block, setBlock] = useState<string>('');
  const [blocks, setBlocks] = useState<any>([]);
  const [cluster, setCluster] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [iseditroute, setIseditroute] = useState<boolean>(false);
  const [clusteroptions, setClusteroptions] = useState<any>([]);
  const [helperTexts, setHelperTexts] = useState<HelperTextType>({
    name: '',
    location: '',
    contact: '',
    block: '',
    cluster: '',
    village: '',
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
          snackbarMessage: iseditroute
            ? 'SHG Updated Successfully'
            : 'SHG Registered Successfully',
          snackbarType: 'success',
        })
      );
    if (user.token) {
      dispatch(fetchAllShgData(user.token));
    }
    getallzones();
    getallblocks();
  }, [status, dispatch]);
  useEffect(() => {
    if (urllocation.pathname.split('/')[3] === 'editshg') {
      setIseditroute(true);
      if (blocks.length > 0 && shgid === '') {
        console.log('edit');
        getdata(urllocation.pathname.split('/')[4]);
      }
    }
  }, [blocks, urllocation, shgid]);
  const getdata = async (id: String) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('authorization', `Bearer ${user.token}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers,
      redirect: 'follow',
    };
    try {
      const response = await fetch(
        `https://backend.cgshgmart.com/ceo/getshgdatabyid/${id}`,
        requestOptions
      );
      const result = await response.json();
      setShgId(result.shgdata._id);
      setContact(result.shgdata.contact);
      setName(result.shgdata.name);
      setLocation(result.shgdata.location);
      setBlock(result.shgdata.block);
      handleclusteroptionsandsetcluster(
        result.shgdata.block,
        result.shgdata.cluster
      );
      setVillage(result.shgdata.village);
    } catch (error: any) {
      console.log(error);
    }
  };
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
        await response.json().then((res) => {
          if (res.error) setError(res.error);
          else setError('Error while Registering ,Please try again');
          throw new Error('Error while Registering ,Please try again');
        });
      }
      setStatus('succeeded');
      setName('');
      setLocation('');
      setContact('');
      setBlock('');
      setCluster('');
      setVillage('');
      return;
    } catch (error: any) {
      setStatus('failed');
      return;
    }
  };

  const Update = async (data: any) => {
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
        'https://backend.cgshgmart.com/ceo/updateshgdata',
        requestOptions
      );
      if (response.status !== 200) {
        await response.json().then((res) => {
          if (res.error) setError(res.error);
          else setError('Error while Updating ,Please try again');
          throw new Error('Error while Updating ,Please try again');
        });
      }
      setStatus('succeeded');
      setName('');
      setLocation('');
      setContact('');
      setBlock('');
      setCluster('');
      setVillage('');
      navigate('/dashboard/admin/view-all-shgs');
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
      setHelperTexts((prev) => ({ ...prev, village: 'Location is required' }));
    else if (!contact)
      setHelperTexts((prev) => ({ ...prev, contact: 'Contact is required' }));
    else if (contact.length !== 10)
      setHelperTexts((prev) => ({
        ...prev,
        contact: 'Contact length should be 10',
      }));
    else if (!block)
      setHelperTexts((prev) => ({ ...prev, village: 'Block is required' }));
    else if (!cluster)
      setHelperTexts((prev) => ({ ...prev, village: 'Cluster is required' }));
    else if (!village)
      setHelperTexts((prev) => ({
        ...prev,
        village: 'Village/Town Name is required',
      }));
    else register({ name, location, contact, block, cluster, village });
  };
  const handleUpdate = async () => {
    if (!name)
      setHelperTexts((prev) => ({ ...prev, name: 'SHG Name is required' }));
    else if (!location)
      setHelperTexts((prev) => ({ ...prev, village: 'Location is required' }));
    else if (!contact)
      setHelperTexts((prev) => ({ ...prev, contact: 'Contact is required' }));
    else if (contact.length !== 10)
      setHelperTexts((prev) => ({
        ...prev,
        contact: 'Contact length should be 10',
      }));
    else if (!block)
      setHelperTexts((prev) => ({ ...prev, village: 'Block is required' }));
    else if (!cluster)
      setHelperTexts((prev) => ({ ...prev, village: 'Cluster is required' }));
    else if (!village)
      setHelperTexts((prev) => ({
        ...prev,
        village: 'Village/Town Name is required',
      }));
    else Update({ name, location, contact, block, cluster, village, shgid });
  };
  const handleclusteroptions = (block: string) => {
    const options = blocks.filter(
      (blockdata: any) => blockdata.blockname === block
    );
    setClusteroptions(options[0].clusters);
    setCluster('');
  };
  const handleclusteroptionsandsetcluster = (
    block: string,
    cluster: string
  ) => {
    const options = blocks.filter(
      (blockdata: any) => blockdata.blockname === block
    );
    setClusteroptions(options[0].clusters);
    setCluster(cluster);
  };
  if (iseditroute && shgid === '') return <Loading2 />;
  return (
    <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
      <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
        <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h2">
            {iseditroute ? 'Update SHG' : 'Register New Shg'}
          </Typography>
          <Typography
            variant="body1"
            color="secondary.dark"
          >
            {iseditroute
              ? 'Enter Updated SHG details below'
              : 'Enter SHG details below'}
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
            {blocks.map((block: any) => (
              <MenuItem value={block.blockname}>{block.blockname}</MenuItem>
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
              <MenuItem value={clusterd.clustername}>
                {clusterd.clustername}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <StyledTextField
            helperText={helperTexts.village}
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            sx={{ borderRadius: '0.8rem', width: '100%' }}
            label="Village/Town Name"
            variant="outlined"
            type="text"
          />
        </FormControl>
        {iseditroute ? (
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
            onClick={handleUpdate}
          >
            Update
          </StyledButton>
        ) : (
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
        )}
      </ContainerColumnBox>
    </StyledPaper>
  );
};

export default RegisterShg;
