import { Box } from '@mui/material';
import React from 'react';
import LoginForm from '../../features/auth/LoginForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Container, Typography, Grid } from '@mui/material';
const LandingPage = () => {
  return (
    <Container sx={{ minWidth: '90vw' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src="/cglogo.png"
          alt="logo"
          width="100px"
          height="100px"
        />
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            margin: '30px',
            fontWeight: 'bold',
          }}
        >
          Online SHG Item Procurement System
        </Typography>
      </Box>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={true}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Autoplay, Navigation, Pagination]}
      >
        <SwiperSlide>
          <Grid
            container
            columns={{ xs: 2 }}
          >
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
            <Grid item>
              <img
                width="100%"
                alt="cm"
                height="500px"
                object-fit="cover"
                src="https://gumlet.assettype.com/freepressjournal/2020-10/05ad4dc5-93bf-43ab-83f0-9915fcd9baf7/741CD789_C517_4AD1_A738_8F20F9D273D8.jpeg?format=webp&w=400&dpr=2.6"
              />
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
            columns={{ xs: 2 }}
          >
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
            <Grid item>
              <img
                width="100%"
                alt="cm"
                height="500px"
                object-fit="cover"
                src="https://cgstate.gov.in/documents/10179/1556f570-7dce-487f-8d08-90ffcf9e7034"
              />
            </Grid>
          </Grid>
        </SwiperSlide>
      </Swiper>

      <Grid
        container
        columns={{ xs: 2 }}
      >
        <Grid
          item
          xs={1}
        >
          <Box
            sx={{
              minHeight: '80vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h4"
              sx={{ textAlign: 'center', margin: '35px' }}
            >
              Self Help Group
            </Typography>
            <Typography
              variant="h2"
              sx={{ textAlign: 'center', margin: '18px', fontWeight: '300' }}
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
        </Grid>
        <Grid
          item
          xs={1}
        >
          <Box
            sx={{
              minHeight: '80vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <LoginForm />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LandingPage;
