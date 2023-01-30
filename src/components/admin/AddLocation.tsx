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
  location: string;
}
interface HelperTextType2 {
  block: string;
}
interface HelperTextType3 {
  clustername: string;
}
const AddLocation = () => {
  const [status, setStatus] = useState('');
  const [status2, setStatus2] = useState('');
  const [status3, setStatus3] = useState('');
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [location, setLocation] = useState<string>('');
  const [block, setBlock] = useState<string>('');
  const [blocks, setBlocks] = useState<any>([]);
  const [blockid, setBlockId] = useState<string>('');
  const [cluster, setCluster] = useState<string>('');
  const [helperTexts, setHelperTexts] = useState<HelperTextType>({
    location: '',
  });
  const [helperTexts2, setHelperTexts2] = useState<HelperTextType2>({
    block: '',
  });
  const [helperTexts3, setHelperTexts3] = useState<HelperTextType3>({
    clustername: '',
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
          snackbarMessage: 'Location Added Successfully',
          snackbarType: 'success',
        })
      );
    if (status2 === 'loading')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Please Wait',
          snackbarType: 'info',
        })
      );
    if (status2 === 'failed')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Error while Adding Block ,Please try again',
          snackbarType: 'error',
        })
      );
    if (status2 === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Block Added Successfully',
          snackbarType: 'success',
        })
      );
    if (status3 === 'loading')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Please Wait',
          snackbarType: 'info',
        })
      );
    if (status3 === 'failed')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Error while Adding Cluster ,Please try again',
          snackbarType: 'error',
        })
      );
    if (status3 === 'succeeded')
      dispatch(
        handleOpenSnackbar({
          snackbarMessage: 'Cluster Added Successfully',
          snackbarType: 'success',
        })
      );
    if (user.token) {
      dispatch(fetchAllShgData(user.token));
    }
    getallblocks();
  }, [status, dispatch, status2, status3]);
  const AddLocation = async (location: string) => {
    setStatus('loading');
    const requestOptions: RequestInit = {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ zone: location }),
    };

    try {
      const response = await fetch(
        'https://backend.cgshgmart.com/zone/add',
        requestOptions
      );

      const result = await response.json();
      if (result.success) {
        setStatus('succeeded');
        setLocation('');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      setStatus('failed');
    }
  };

  const AddCluster = async (blockid: string, clustername: string) => {
    setStatus3('loading');
    const requestOptions: RequestInit = {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ blockid: blockid, clustername: clustername }),
    };

    try {
      const response = await fetch(
        'https://backend.cgshgmart.com/ceo/addcluster',
        requestOptions
      );

      const result = await response.json();
      if (result.success) {
        setStatus3('succeeded');
        setBlockId('');
        setCluster('');
      } else {
        setStatus3('failed');
      }
    } catch (error) {
      setStatus3('failed');
    }
  };

  const AddBlock = async (block: string) => {
    setStatus2('loading');
    const requestOptions: RequestInit = {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ blockname: block }),
    };

    try {
      const response = await fetch(
        'https://backend.cgshgmart.com/ceo/addblock',
        requestOptions
      );

      const result = await response.json();
      if (result.success) {
        setStatus2('succeeded');
        setBlock('');
      } else {
        setStatus2('failed');
      }
    } catch (error) {
      setStatus2('failed');
    }
  };
  const handleRegister = async () => {
    if (!location)
      setHelperTexts((prev) => ({
        ...prev,
        location: 'Location name is required',
      }));
    else {
      AddLocation(location.toLowerCase());
    }
  };
  const handleAddBlock = async () => {
    if (!block)
      setHelperTexts2((prev) => ({
        ...prev,
        block: 'Block name is required',
      }));
    else {
      AddBlock(block);
    }
  };
  const handleAddCluster = async () => {
    if (!blockid)
      setHelperTexts3((prev) => ({
        ...prev,
        clustername: 'Select Block',
      }));
    else if (!cluster)
      setHelperTexts3((prev) => ({
        ...prev,
        clustername: 'Cluster name is required',
      }));
    else {
      AddCluster(blockid, cluster);
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
  return (
    <>
      <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
        <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
          <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h2">Add New Location</Typography>
          </ContainerColumnBox>
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
            Submit
          </StyledButton>
        </ContainerColumnBox>
      </StyledPaper>
      <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
        <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
          <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h2">Add New Block</Typography>
          </ContainerColumnBox>
          <FormControl>
            <StyledTextField
              helperText={helperTexts2.block}
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              sx={{ borderRadius: '0.8rem', width: '100%' }}
              label="Block"
              variant="outlined"
              type="text"
            />
          </FormControl>

          <StyledButton
            startIcon={
              status2 === 'loading' ? (
                <CircularProgress sx={{ color: 'white' }} />
              ) : null
            }
            variant="contained"
            color="primary"
            sx={{ padding: '0.75rem 1.2rem' }}
            type="submit"
            onClick={handleAddBlock}
          >
            Submit
          </StyledButton>
        </ContainerColumnBox>
      </StyledPaper>
      <StyledPaper sx={{ width: '60%', margin: 'auto' }}>
        <ContainerColumnBox sx={{ rowGap: '1.5rem' }}>
          <ContainerColumnBox sx={{ rowGap: '1rem', marginBottom: '1rem' }}>
            <Typography variant="h2">Add New Cluster</Typography>
          </ContainerColumnBox>
          <FormControl>
            <InputLabel id="block-label">Block</InputLabel>
            <Select
              labelId="block-label"
              value={blockid}
              label="Block"
              onChange={(e) => setBlockId(e.target.value)}
            >
              {blocks.map((block: any) => (
                <MenuItem value={block._id}>
                  {block.blockname.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <StyledTextField
              helperText={helperTexts3.clustername}
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              sx={{ borderRadius: '0.8rem', width: '100%' }}
              label="Cluster"
              variant="outlined"
              type="text"
            />
          </FormControl>

          <StyledButton
            startIcon={
              status3 === 'loading' ? (
                <CircularProgress sx={{ color: 'white' }} />
              ) : null
            }
            variant="contained"
            color="primary"
            sx={{ padding: '0.75rem 1.2rem' }}
            type="submit"
            onClick={handleAddCluster}
          >
            Submit
          </StyledButton>
        </ContainerColumnBox>
      </StyledPaper>
    </>
  );
};

export default AddLocation;
