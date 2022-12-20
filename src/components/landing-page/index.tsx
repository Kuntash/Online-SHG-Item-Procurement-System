import { Box, Button } from '@mui/material';
import React, { useRef } from 'react';
import LoginForm from '../../features/auth/LoginForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Container, Typography, Grid } from '@mui/material';
const LandingPage = () => {
  const loginRef = useRef<HTMLInputElement>(null);
  const focusLogin = ()=>{
    loginRef.current?.scrollIntoView({behavior:'smooth'});
  }
  return (
    <>
      <Container sx={{
      padding:"10px 6px",
      // backgroundColor: 'rgb(200, 48, 48)',
      // color: 'white'
      }}>
      <Grid
        container
        columns={{ xs: 1, sm: 2 }}
        sx={{
          maxWidth: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Grid item sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
          <Box component="span">
          <img
            src="/cglogo.png"
            alt="logo"
            width="50px"
            height="50px"
          /> </Box>
        <Box component="span">
          <Typography
            variant="h6"
            color="primary"
            sx={{
              textAlign: 'center',
              margin: '4.5px 10px',
              fontWeight: 'bold',
              fontSize:{xs:'0.7rem',sm:"1rem"}
            }}
          >
            Online SHG Item Procurement System
          </Typography>
        </Box>
        </Grid>
        <Grid item><Button onClick={focusLogin} sx={{cursor:'pointer',padding:'0.5rem 1rem'}}><Typography variant='button'>Login</Typography></Button></Grid>
      </Grid>
      </Container>
      <Box>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={true}
        // navigation={true}
        pagination={{ clickable: true }}
        modules={[Autoplay, Navigation, Pagination]}
      >
        <SwiperSlide>
          <Grid
            container
            columns={{ xs: 1, sm: 2 }}
          >
            <Grid item>
              <img
                width="100%"
                alt="cm"
                height="500px"
                object-fit="cover"
                src="https://gumlet.assettype.com/freepressjournal/2020-10/05ad4dc5-93bf-43ab-83f0-9915fcd9baf7/741CD789_C517_4AD1_A738_8F20F9D273D8.jpeg?format=webp&w=400&dpr=2.6"
              />
            </Grid>
            <Grid
              item
              xs={1}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ textAlign: 'center', margin: '35px' }}
                >
                  Chhattisgarh Chief Minister Bhupesh Baghel announced waiving
                  off the overdue or unpaid loans worth Rs 12.77 crore of the
                  women Self-Help Groups (SHGs) so that they can avail fresh
                  loans to start new economic activities.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </SwiperSlide>
        <SwiperSlide>
          <img
            width="100%"
            alt="cm"
            height="500px"
            style={{ objectFit: 'cover' }}
            src="/cm-01.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            width="100%"
            alt="cm"
            height="500px"
            object-fit="cover"
            src="https://cgstate.gov.in/ImageGallary-portlet/images/image0.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Grid
            container
            columns={{ xs: 1, sm: 2 }}
          >
            <Grid item>
              <img
                width="100%"
                alt="cm"
                height="500px"
                object-fit="cover"
                src="https://cgstate.gov.in/documents/10179/1556f570-7dce-487f-8d08-90ffcf9e7034"
              />
            </Grid>
            <Grid
              item
              xs={1}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ textAlign: 'center', margin: '35px' }}
                >
                  Chhattisgarh Chief Minister Bhupesh Baghel decided to hike the
                  budgetary sanction for loans provided to women groups by five
                  times to Rs 10 crore from the present Rs 2 crore every year.
                  The loan limit of SHGs is also raised from Rs one lakh to Rs
                  two lakh
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </SwiperSlide>
      </Swiper>
      </Box>
      {/* <Grid
        container
        columns={{ xs: 1, sm: 2 }}
      >
        <Grid
          item
          xs={1}
        > */}
        <Container>
          <Box
            sx={{
              padding:'3rem 0.5rem',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              position:'relative',
              overflow:'hidden'
            }}
          >
            <Box sx={{
              position: 'absolute',
              inset:'auto 0 -5% 0',
              zIndex:'-1',
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ff3030" fill-opacity="0.9" d="M0,288L30,288C60,288,120,288,180,266.7C240,245,300,203,360,192C420,181,480,203,540,224C600,245,660,267,720,266.7C780,267,840,245,900,229.3C960,213,1020,203,1080,170.7C1140,139,1200,85,1260,64C1320,43,1380,53,1410,58.7L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>
            </Box>
            <Typography
              variant="h2"
              color='primary'
              sx={{ margin: '1rem',textTransform:'uppercase' }}
            >
             About Self Help Group
            </Typography>
            <Typography
              variant="h2"
              sx={{ margin: '18px', fontWeight: '300',mixBlendMode:'multiply' }}
            >
            A self-help group is a financial intermediary committee usually
            composed of 12 to 25 local women between the ages of 18 and 50.
            Most self-help groups are in India, though they can be found in
            other countries, especially in South Asia and Southeast Asia. A
            SHG is generally a group of people who work on daily wages who
            form a loose grouping or union. Money is collected from those who
            are able to donate and given to members in need.
            </Typography>
          </Box>
        {/* </Grid> */}
        {/* <Grid container> */}
        {/* <Grid item xs={1}
        sx={{
          backgroundColor:'#ff3030',
          position:'relative',
          padding:'4rem 2rem'
        }}
        >
        <Typography variant='h2' color='white'>Welcome!</Typography>
        <Typography variant="body1">Enter your details to login</Typography> */}
        {/* <Box sx={{
          position:'absolute',
          inset:'0 0 0 0',
          zIndex:'-1'
        }}>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FF3030" d="M58.3,-66.9C74.1,-56.3,84.4,-36.5,81.1,-19.6C77.9,-2.6,61,11.5,49.6,26.1C38.1,40.7,32,55.9,21.3,60.9C10.5,65.9,-4.8,60.7,-19,54.5C-33.2,48.3,-46.2,41.2,-52.4,30.3C-58.6,19.4,-58,4.6,-55.9,-10.2C-53.7,-25.1,-50,-40.1,-40.4,-51.7C-30.8,-63.4,-15.4,-71.8,2.9,-75.3C21.3,-78.8,42.6,-77.4,58.3,-66.9Z" transform="translate(100 100)" />
</svg>
        </Box>
        hello */}
        {/* </Grid> */}
        {/* <Grid
          item
          xs={1}
        > */}
          <Box
            sx={{
              minHeight: '80vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <LoginForm ref={loginRef} />

          </Box>
        {/* </Grid> */}
      {/* </Grid> */}
          </Container>
      <Box sx={{
        backgroundColor:'#000000',
        color: 'white'
      }}>
        <Box sx={{
          width:'100%',
          backgroundColor:'#ffffff40',
          textAlign: 'center',
          padding: '5px'
        }}>
        <Typography variant="body1">
          About Us / Contact Us / Feedback
          </Typography>
        </Box>
        <Box sx={{
          padding:'30px',
          textAlign: 'center'
        }}>
          <Typography variant='caption'>
            Some links <br />
            Copyright 2022
          </Typography>
        </Box>
    </Box>
      </>
  );
};

export default LandingPage;
