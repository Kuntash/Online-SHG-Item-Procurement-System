import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import {StyledButton} from '../../components/custom'
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
  return (
    <div style={{width:'70%',margin:'auto'}}>
        <h1 style={{display:'flex',alignItems:'center',justifyContent:'center',margin:'20px auto'}}>Self Help Group Order Management System</h1>
        <Swiper
    spaceBetween={50}
    slidesPerView={1}
    autoplay={true}
    modules={[Autoplay]}
  >
    <SwiperSlide><img width="100%" height="500px" object-fit="cover" src="https://gumlet.assettype.com/freepressjournal/2020-10/05ad4dc5-93bf-43ab-83f0-9915fcd9baf7/741CD789_C517_4AD1_A738_8F20F9D273D8.jpeg?format=webp&w=400&dpr=2.6" /></SwiperSlide>
    <SwiperSlide><img width="100%" height="500px" object-fit="cover" src="https://cgstate.gov.in/ImageGallary-portlet/images/image0.jpg" /></SwiperSlide>
    <SwiperSlide><img width="100%" height="500px" object-fit="cover" src="https://cgstate.gov.in/documents/10179/1556f570-7dce-487f-8d08-90ffcf9e7034" /></SwiperSlide>
    
  </Swiper>
  <div style={{display:'flex',margin:'50px'}}>
      <div style={{width:'50%'}}>
            <h2 style={{display:'flex',alignItems:'center',margin:'20px auto'}}>Self Help Group</h2>
            <p>A self-help group is a financial intermediary committee usually composed of 12 to 25 local women between the ages of 18 and 50. Most self-help groups are in India, though they can be found in other countries, especially in South Asia and Southeast Asia. A SHG is generally a group of people who work on daily wages who form a loose grouping or union. Money is collected from those who are able to donate and given to members in need.</p>
      </div>
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'50%'}}>
            {/* <button style={{width:'200px',height:'40px',backgroundColor:'rgb(0 119 255)',border:'0',borderRadius:'10px',color:'#fff',fontSize:'20px',cursor:'pointer'}}>Login</button> */}
            <StyledButton variant="contained"
          color="primary"
          sx={{ padding: '0.75rem 1.2rem' }}
          type="submit"
          onClick={()=>navigate('/login')}
          >Login</StyledButton>
      </div>
  </div>
  </div>
  )
}

export default Home