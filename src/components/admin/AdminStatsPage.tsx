import {
  Typography,
  Grid,
  Box,
  Container
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  ContainerColumnBox,
  ContainerRowBox,
  StyledPaper,
} from '../custom';
import { selectUser } from '../../features/auth/authSlice';
import { LabelSharp, ShoppingCart } from '@mui/icons-material';
import { backendUrl } from '../../config';
import Loading2 from '../utility/Loading2';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import CountUp from 'react-countup';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
const Icons = [
  <PersonRoundedIcon sx={{ fontSize: '4rem' }} />,
  <ShoppingBagRoundedIcon sx={{ fontSize: '4rem' }} />,
  <InventoryRoundedIcon sx={{ fontSize: '4rem' }} />,
  <ShowChartRoundedIcon sx={{ fontSize: '4rem' }} />,
  <ShoppingCart sx={{ fontSize: '4rem' }} />,
  <AccessTimeRoundedIcon sx={{ fontSize: '4rem' }} />,
];


const AdminStatsPage = () => {
  const [status, setStatus] = useState('');
  const [stats, setStats] = useState<any>({});
  const user = useAppSelector(selectUser);
  const keys = Object.keys(stats);
  const values = Object.values(stats);

  useEffect(() => {

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
        const result: Object = await response.json();
        setStatus('success');
        //   const formatedResult = Object.entries(result)
        setStats(result);
        console.log("stats", result);
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [])

  return (
    <Box sx={{ backgroundColor: 'rgb(232, 232, 232)' }}>
      <Typography variant='h2' sx={{ margin: '1rem' }}>Dashboard</Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} direction="row" justifyContent="center" alignItems="center" sx={{
        padding:'0 2rem'
      }}>
        {status === 'success' ? keys.map((s, i) => {
          if (i === 0 || i > keys.length - 4) return <></>
          return <Grid sx={{padding:'1rem'}} item xs={3}><StatCard key={i} title={s} count={values[i]} i={i} /></Grid>
        }) : <Loading2 />}
        <Grid item xs={4}>
          <PieChart data={values.splice(values.length - 3, 3)} />
        </Grid>
        <Grid item xs={8}>
          <LineChart />
        </Grid>
      </Grid>


    </Box>
  )
}

export default AdminStatsPage;

const StatCard = ({ title, count, i }: any) => {
  console.log(title, count, i)

  return (
    <StyledPaper sx={{ aspectRatio: '1.5 / 1' }}>
      <ContainerColumnBox sx={{ justifyContent: 'center', height: '100%' }}>
        <ContainerRowBox justifyContent='flex-end'><Typography variant='body1' sx={{ textTransform: 'capitalize' }}>{title}</Typography></ContainerRowBox>
        <ContainerRowBox sx={{ height: "100%", alignItems: "center", justifyContent: 'space-between' }}>

          <Typography color='primary' sx={{
            boxShadow:
              'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
          }}>{Icons[i - 1]}</Typography>
          <Typography variant="h2" color='primary'>
            <CountUp
              start={count / 3}
              end={count}
              duration={1}
            /></Typography>
        </ContainerRowBox>
        <ContainerRowBox></ContainerRowBox>
      </ContainerColumnBox>
    </StyledPaper>

  )
}

const PieChart = (props: any) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Orders',
      },
    },
  };


  const data = {
    labels: ['Completed', 'Pending', 'Payment Pending'],
    datasets: [
      {
        label: 'orders',
        data: props.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <StyledPaper>
      <Doughnut options={options} data={data} />
    </StyledPaper>
  )
}

const LineChart = (props: any) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const labels = [];
  for (let i = 0; i < 10; i++) {
    labels.push('items: ' + i);
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Items',
        data: [10000, 9000, 8000, 7000, 6544, 4345, 2323, 1987, 1500, 1000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top Items',
      },
    },
  };
  return (
    <StyledPaper sx={{
      marginTop:'1rem'
    }}>
      <Line data={data} options={options} />

    </StyledPaper>
  )
}