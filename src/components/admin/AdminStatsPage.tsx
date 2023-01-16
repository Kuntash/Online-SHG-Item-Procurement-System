import {
    Typography,
    Grid
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import { useAppDispatch, useAppSelector } from '../../app/hooks';
  import {
    ContainerColumnBox,
    ContainerRowBox,
    StyledPaper,
  } from '../custom';
  import { selectUser } from '../../features/auth/authSlice';
import { ShoppingCart } from '@mui/icons-material';
import { backendUrl } from '../../config';
import Loading2 from '../utility/Loading2';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import CountUp from 'react-countup';
const Icons =[
    <PersonRoundedIcon sx={{fontSize:'4rem'}}  />,
    <ShoppingBagRoundedIcon sx={{fontSize:'4rem'}}/>,
    <InventoryRoundedIcon sx={{fontSize:'4rem'}}/>,
    <ShowChartRoundedIcon sx={{fontSize:'4rem'}}/>,
    <ShoppingCart sx={{fontSize:'4rem'}}/>,
    <AccessTimeRoundedIcon sx={{fontSize:'4rem'}}/>,
];
    

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

    return (
    <>
    <Typography variant='h2' sx={{margin:'1rem'}}>Dashboard</Typography>
    <Grid container gap='1rem' columns={3}>
        {status === 'success'?keys.map((s,i)=>{
        if(i===0) return <></>
        return <Grid item><StatCard key={i} title={s} count={values[i]} i={i} /></Grid>
        }):<Loading2 />}
    </Grid>
    </>
    )
  }
  
  export default AdminStatsPage;

  const StatCard = ({title,count,i}:any)=>{
    console.log(title,count,i)

    return (
        <StyledPaper sx={{ width: '300px',aspectRatio:'1.3 / 1', margin: 'auto' }}>
          <ContainerColumnBox sx={{justifyContent:'center',height:'100%'}}>
          <ContainerRowBox justifyContent='flex-end'><Typography variant='body1' sx={{textTransform:'capitalize'}}>{title}</Typography></ContainerRowBox>
          <ContainerRowBox sx={{height:"100%",alignItems:"center",justifyContent:'space-between'}}>
              <Typography color='primary'>{Icons[i-1]}</Typography>
              <Typography variant="h1" color='primary'>
            <CountUp
              start={count*30}
              end={count}
              duration={1}
            /></Typography>
          </ContainerRowBox>
          <ContainerRowBox></ContainerRowBox>
          </ContainerColumnBox>
        </StyledPaper>

    )
  }
  