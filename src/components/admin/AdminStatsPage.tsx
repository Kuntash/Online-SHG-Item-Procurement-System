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
    ContainerRowBox,
    StyledButton,
    StyledContainer,
    StyledPaper,
    StyledTextField,
  } from '../custom';
  import { handleOpenSnackbar } from '../../features/utilityStates/utilitySlice';
  import { selectUser } from '../../features/auth/authSlice';
  import { fetchAllShgData } from '../../features/adminData/adminDataSlice';
import { ShoppingCart } from '@mui/icons-material';
import { backendUrl } from '../../config';
import Loading2 from '../utility/Loading2';

  const AdminStatsPage = () => {
    const [status, setStatus] = useState('');
    const [stats,setStats] = useState<any>({});
    const user = useAppSelector(selectUser);
    const keys = Object.keys(stats);
    const values = Object.values(stats);

    useEffect(()=>{
        
    const getStats = async () => {
        try {
          const headers = new Headers();
          headers.append('Authorization', `Bearer ${user.token}`);
          headers.append('Content-type', 'application/json');
          headers.append('Access-Control-Allow-Origin', '*');
          const requestOptions: RequestInit = {
            method: 'GET',
            headers,
            redirect: 'follow',
          };
          setStatus('loading')
          const response = await fetch(
            `${backendUrl}ceo/getstats`,
            requestOptions
          );
          if (response.status === 400)
            throw new Error('Error occurred while getting saved order');
          const result : Object = await response.json();
          setStatus('success');
        //   const formatedResult = Object.entries(result)
          setStats(result);
          console.log("stats",result);
        } catch (err) {
          console.log(err);
        }
      };
      getStats();
    },[])

    useEffect(() => {
        console.log("stats",keys,values);
    },[keys,values]);
  
    return (
    <StyledContainer sx={{
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap:'wrap',
        alignItems: 'center',
        width: '100%',
        gap: '1rem'
    }}>
        {status === 'success'?keys.map((s,i)=>{
        if(i===0) return <></>
        return <StatCard key={i} title={s} count={values[i]} />
        }):<Loading2 />}
    </StyledContainer>
    );
  };
  
  export default AdminStatsPage;

  const StatCard = ({title,count}:any)=>{

    return (
        <StyledPaper sx={{ width: '200px',aspectRatio:'1.3 / 1', margin: 'auto' }}>
          <ContainerColumnBox sx={{justifyContent:'center',height:'100%'}}>
          <ContainerRowBox justifyContent='flex-end'><Typography variant='caption'>{title}</Typography></ContainerRowBox>
          <ContainerRowBox sx={{height:"100%",alignItems:"center",justifyContent:'space-between'}}>
              <ShoppingCart color='primary' sx={{fontSize:'50px'}} />
              <Typography variant="h2" color='primary'>{count}</Typography>
          </ContainerRowBox>
          <ContainerRowBox></ContainerRowBox>
          </ContainerColumnBox>
        </StyledPaper>

    )
  }
  