import { Box, Button, colors } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import LoginForm from '../../features/auth/LoginForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Container, Typography, Grid } from '@mui/material';
import Announcement from '../../assets/announcement.svg';
import { parseISO, format } from 'date-fns';
import {
  ContainerColumnBox,
  ContainerRowBox,
  StyledButton,
  StyledPaper,
  StyledTextField,
} from '../../components/custom';
import { height } from '@mui/system';
import CountUp from 'react-countup';
import { FacebookRounded, YouTube } from '@mui/icons-material';
import bihralogo from '../../assets/bihralogo.jpg';
const LandingPage = () => {
  const [announcement, setAnnouncement] = useState<any>([]);
  const [top, setTop] = useState<number>(0);
  const loginRef = useRef<HTMLInputElement>(null);
  const focusLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const getdata = async () => {
    const response = await fetch(
      'https://backend.cgshgmart.com/ceo/getallannouncements',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    setAnnouncement(data.announcements);
  };
  useEffect(() => {
    if (announcement.length === 0) {
      getdata();
    }
  }, []);
  const setTopdata = () => {
    setTop(top - 0.25);
  };
  useEffect(() => {
    setTopdata();
    if (top === -200) {
      setTop(300);
    }
  }, [top]);

  return (
    <>
      <Container
        sx={{
          marginTop: '1rem',
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
            <img
              src={bihralogo}
              width="80px"
              height="80px"
              alt="bihralogo"
            />
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ margin: '0.5rem 1.5rem' }}>
        <Typography
          variant="h4"
          color="primary"
          textAlign="center"
          width="100%"
        >
          हर महिला समूह में, हर समूह आर्थिक गतिविधि में।
        </Typography>
      </Box>
      <Box sx={{ margin: '0.5rem 1.5rem' }}>
        <Typography
          variant="h4"
          color="primary"
          textAlign="center"
          width="100%"
        >
          आरूग अंगना,आरूग उत्पाद ।
        </Typography>
      </Box>
      <Box sx={{ margin: '0.5rem 1.5rem', border: '1px solid #9994' }}>
        <Swiper
          // style={{ padding: '1rem' }}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          autoplay={true}
          // navigation={true}
          pagination={{ clickable: true }}
          modules={[Autoplay, Navigation, Pagination]}
        >
          <SwiperSlide
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 4rem',
                fontSize: '64px',
                fontWeight: '500',
              }}
            >
              सेवा-जतन-सरोकार <br /> छत्तीसगढ़ सरकार
            </Box>
            <Box style={{ width: '50%' }}>
              <img
                width="100%"
                alt="cm"
                object-fit="cover"
                src="/cm-01.jpg"
              />
            </Box>
          </SwiperSlide>
          <SwiperSlide
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box style={{ width: '50%' }}>
              <img
                width="100%"
                alt="cm"
                object-fit="cover"
                src="https://cgstate.gov.in/documents/10179/1556f570-7dce-487f-8d08-90ffcf9e7034"
              />
            </Box>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 4rem',
                fontSize: '24px',
                fontWeight: '400',
              }}
            >
              छत्तीसगढ़ राज्य ग्रामीण आजीविका मिशन ‘‘बिहान’’ अंतर्गत रायपुर जिले
              के सभी 476 ग्रामों में 11378 महिला स्व सहायता समूह का गठन कर
              120697 परिवारों को जोड़ा गया है। CG SHG Mart वेब एप्लीकेशन एवं
              मोबाईल एप्प के माध्यम से स्व सहायता समूहों, उत्पादक समूह, गौठान,
              रीपा आदि के उत्पादों को विक्रय हेतु एक माध्यम उपलब्ध करवाया गया
              है।
            </Box>
          </SwiperSlide>
          <SwiperSlide
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 4rem',
                fontSize: '24px',
                fontWeight: '400',
              }}
            >
              छत्तीसगढ़ राज्य ग्रामीण आजीविका मिशन ‘‘बिहान’’ अंतर्गत रायपुर जिले
              के सभी 476 ग्रामों में 11378 महिला स्व सहायता समूह का गठन कर
              120697 परिवारों को जोड़ा गया है। CG SHG Mart वेब एप्लीकेशन एवं
              मोबाईल एप्प के माध्यम से स्व सहायता समूहों, उत्पादक समूह, गौठान,
              रीपा आदि के उत्पादों को विक्रय हेतु एक माध्यम उपलब्ध करवाया गया
              है।
            </Box>
            <Box style={{ width: '50%' }}>
              <img
                width="100%"
                alt="cm"
                object-fit="cover"
                src="https://gumlet.assettype.com/freepressjournal/2020-10/05ad4dc5-93bf-43ab-83f0-9915fcd9baf7/741CD789_C517_4AD1_A738_8F20F9D273D8.jpeg?format=webp&w=400&dpr=2.6"
              />
            </Box>
          </SwiperSlide>
          {/* <SwiperSlide
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box style={{ width: '50%' }}>
              <img
                width="100%"
                alt="cm"
                object-fit="fill"
                src="/1.jpg"
              />
            </Box>
          </SwiperSlide> */}
        </Swiper>
      </Box>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: 'rgba(71, 186, 71,0.1)',
          // margin: '4rem 0',
          margin: '0.5rem 0',
          borderRadius: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontWeight: '500',
              color: '#265A1F',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontSize: '36px',
            }}
          >
            <CountUp
              start={9000}
              end={11378}
            />
          </h1>
          <p
            style={{
              fontWeight: '500',
              color: 'rgb(71, 186, 71)',
              marginBottom: '2rem',
            }}
          >
            TOTAL NUMBER OF SHGs
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontWeight: '500',
              color: '#265A1F',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontSize: '36px',
            }}
          >
            <CountUp end={301} />
          </h1>
          <p
            style={{
              fontWeight: '500',
              color: 'rgb(71, 186, 71)',
              marginBottom: '2rem',
            }}
          >
            TOTAL NUMBER OF GOTHAN
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontWeight: '500',
              color: '#265A1F',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontSize: '36px',
            }}
          >
            <CountUp end={130} />
          </h1>
          <p
            style={{
              fontWeight: '500',
              color: 'rgb(71, 186, 71)',
              marginBottom: '2rem',
            }}
          >
            TOTAL NUMBER OF PRODUCER GROUPS
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontWeight: '500',
              color: '#265A1F',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontSize: '36px',
            }}
          >
            <CountUp end={515} />
          </h1>
          <p
            style={{
              fontWeight: '500',
              color: 'rgb(71, 186, 71)',
              marginBottom: '2rem',
            }}
          >
            NUMBER OF VILLAGE ORGANIZATION
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontWeight: '500',
              color: '#265A1F',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontSize: '36px',
            }}
          >
            <CountUp end={10} />
          </h1>
          <p
            style={{
              fontWeight: '500',
              color: 'rgb(71, 186, 71)',
              marginBottom: '2rem',
            }}
          >
            NUMBER OF RIPA
          </p>
        </div>
      </div>
      <Box
        sx={{
          padding: '1.5rem 0.5rem',
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
            transform: 'translateY(-4rem)',
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
          sx={{
            textTransform: 'capitalize',
            fontWeight: '700',
            fontStyle: 'normal',
            fontSize: '28px',
            lineHeight: 'normal',
          }}
        >
          <span style={{ color: '#47BA47' }}>प्रोजेक्ट</span> का विज़न एवं मिशन
        </Typography>
        <Typography
          color="primary"
          sx={{
            margin: '20px 22px',
            lineHeight: 'normal',
            fontWeight: '400',
            mixBlendMode: 'multiply',
            fontSize: '24px',
          }}
        >
          विजन:- महिला स्व सहायता समूहों के उत्पादों को बाजार उपलब्ध करवाने के
          लिए प्लेटफाॅर्म उपलब्ध करवाना।
          <br />
          <br /> मिशन:- स्व सहायता समूहों/उत्पादक समूहों/गौठानो के उत्पाद/रीपा
          के उत्पाद आदि को शासकीय विभागों एवं खुले बाजार मे विक्रय हेतु आॅनलाईन
          प्लेटफाॅर्म उपलब्ध करवाकर, ग्रामीण अर्थव्यवस्था को मजबूती प्रदान करना।
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          height: '53vh',
          marginTop: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StyledPaper
          sx={{
            width: '90%',
            overflow: 'hidden',
            padding: 0,
            borderRadius: '48px',
            height: '100%',
            marginLeft: '4rem',
          }}
        >
          <ContainerColumnBox sx={{ rowGap: '1rem' }}>
            <ContainerColumnBox
              sx={{
                // rowGap: '1rem',
                // marginBottom: '1rem',
                backgroundColor: '#265A1F',
                padding: '1.5rem',
                color: 'white',
                flexDirection: 'row',
                alignItems: 'center',
                zIndex: '999',
              }}
            >
              <img
                src={Announcement}
                style={{ width: '45px', marginRight: '1rem' }}
              />
              <Typography
                variant="h2"
                style={{ fontWeight: '600' }}
              >
                Announcements / Information
              </Typography>
            </ContainerColumnBox>
          </ContainerColumnBox>
          <div style={{ marginTop: `${top}px` }}>
            {announcement.map((announcement: any, index: any) => (
              <div key={index}>
                <Typography
                  color="primary"
                  sx={{
                    margin: '30px 44px',
                    lineHeight: 'normal',
                    fontWeight: '400',
                    mixBlendMode: 'multiply',
                    fontSize: '24px',
                  }}
                >
                  {announcement.title}
                  {' - '}
                  {format(parseISO(announcement.createdAt), 'do MMM yyyy')}
                </Typography>
              </div>
            ))}
          </div>
        </StyledPaper>
        <div
          style={{
            width: '4px',
            backgroundColor: '#d9d9d9',
            height: '380px',
            margin: '1rem 4rem',
          }}
        ></div>
        <LoginForm ref={loginRef} />
      </Box>
      <Box
        sx={{
          backgroundColor: '#000000',
          color: 'white',
          padding: '2rem 0.8rem',
        }}
      >
        {/* <Box
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
        </Box> */}
        {/* <Box
          sx={{
            padding: '30px',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption">
            Developed By National Institute Of Technology, Raipur
            <br />
            Copyright 2023
          </Typography>
        </Box> */}
        <ContainerRowBox
          margin="1rem 0"
          gap="0.8rem"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="caption">Social Links :</Typography>
          <a
            rel="noreferrer"
            href="https://www.facebook.com/profile.php?id=100020707523276&mibextid=ZbWKwL"
            target="_blank"
          >
            <ContainerRowBox
              color="white"
              gap="0.5rem"
              alignItems="center"
            >
              <FacebookRounded />
              <Typography variant="caption">Facebook</Typography>
            </ContainerRowBox>
          </a>
          <Typography
            variant="body1"
            color="gray"
            gap="0.5rem"
            alignItems="center"
          >
            |
          </Typography>
          <a
            rel="noreferrer"
            href="https://www.youtube.com/channel/UCUtQkljJyarbCkVeg9E79UA"
            target="_blank"
          >
            <ContainerRowBox
              color="white"
              gap="0.5rem"
              alignItems="center"
            >
              <YouTube />
              <Typography variant="caption">Youtube</Typography>
            </ContainerRowBox>
          </a>
        </ContainerRowBox>
        <ContainerColumnBox
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography variant="caption">
            Developed By National Institute Of Technology, Raipur
          </Typography>
          <Typography variant="caption">Copyright 2023</Typography>
        </ContainerColumnBox>
      </Box>
    </>
  );
};

export default LandingPage;
