import { Box, Button, colors } from '@mui/material';
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
  const focusLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <Container
        sx={{
          padding: '10px 6px',
        }}
      >
        <Grid
          container
          columns={{ xs: 1, sm: 2 }}
          sx={{
            maxWidth: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Grid
            item
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Box component="span">
              <img
                src="/cglogo.png"
                alt="logo"
                width="70px"
                height="70px"
              />{' '}
            </Box>
            <Box component="span">
              <Typography
                color="primary"
                sx={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontStyle: 'normal',
                  fontSize: '24px',
                  lineHeight: 'normal',
                }}
              >
                Chhattisgarh State Centre
              </Typography>
              <Typography
                sx={{
                  fontWeight: '400',
                  fontSize: '16px',
                  letterSpacing: '0.05em',
                  color: '#47BA47',
                  lineHeight: 'normal',
                }}
              >
                CG SHG Mart
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Button
              onClick={focusLogin}
              sx={{
                borderRadius: '16px',
                cursor: 'pointer',
                padding: '10px 34px',
                backgroundColor: '#47BA47',
                textTransform: 'capitalize',
                boxShadow: '1px 1px 5px rgba(0, 0, 0, 0.25)',
                '&:hover': {
                  backgroundColor: '#555',
                  color: '#000',
                },
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: '700' }}>
                Log in
              </Typography>
            </Button>
          </Grid>
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
                    Chhattisgarh Chief Minister Bhupesh Baghel decided to hike
                    the budgetary sanction for loans provided to women groups by
                    five times to Rs 10 crore from the present Rs 2 crore every
                    year. The loan limit of SHGs is also raised from Rs one lakh
                    to Rs two lakh
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
      <Box
        sx={{
          padding: '5rem 0.5rem',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          position: 'relative',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            zIndex: '-1',
          }}
        >
          <svg
            width="1512"
            height="430"
            viewBox="0 0 1512 430"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1850.34 0.984818C1854.11 70.7986 1782.63 143.107 1644.94 208.767C1507.25 274.426 1309.53 330.487 1076.79 369.861C844.048 409.235 586.733 430.153 337.385 429.969C88.0373 429.786 -142.144 408.51 -324.051 368.832L-130.6 304.133C11.8899 335.213 192.193 351.879 387.51 352.023C582.827 352.166 784.385 335.781 966.695 304.939C1149.01 274.097 1303.88 230.184 1411.73 178.752C1519.59 127.321 1575.58 70.6805 1572.62 15.9946L1850.34 0.984818Z"
              fill="#47BA47"
              fill-opacity="0.1"
            />
          </svg>
        </Box>
          <Typography
            color="primary"
            sx={{textTransform: 'capitalize', 
            fontWeight: '700',
            fontStyle: 'normal',
            fontSize: '36px',
            lineHeight: 'normal', }}
          >
            <span style={{color:'#47BA47'}}>About</span> Self Help Group
          </Typography>
        <Typography
        color="primary"
          sx={{ margin: '60px 72px', lineHeight: 'normal', fontWeight: '400', mixBlendMode: 'multiply', fontSize:"24px" }}
        >
          A self-help group is a financial intermediary committee usually
          composed of 12 to 25 local women between the ages of 18 and 50. Most
          self-help groups are in India, though they can be found in other
          countries, especially in South Asia and Southeast Asia. A SHG is
          generally a group of people who work on daily wages who form a loose
          grouping or union. Money is collected from those who are able to
          donate and given to members in need.
        </Typography>
      </Box>
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
      <Box
        sx={{
          backgroundColor: '#000000',
          color: 'white',
        }}
      >
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#ffffff40',
            textAlign: 'center',
            padding: '5px',
          }}
        >
          <Typography variant="body1">
            About Us / Contact Us / Feedback
          </Typography>
        </Box>
        <Box
          sx={{
            padding: '30px',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption">
            Developed By National Institute Of Technology, Raipur<br />
            Copyright 2023 
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default LandingPage;
