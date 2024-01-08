import React from 'react';
import { Container, Typography, styled } from '@mui/material';
import Carousel from './Carousel';

const StyledBanner = styled('div')({
  backgroundImage: "url(./banner2.jpg)",
  height: 400,
  display: "flex",
  flexDirection: "column",
  paddingTop: 25,
  justifyContent: "space-around",
  tagline: {
    display: "flex",
    height: "40%",
    flexDirection: "column",
    paddingTop: 25,
    justifyContent: "center",
    textAlign: "center",
  }
});

const StyledBannerContent = styled(Container)({
    
  });
//text in the first banner
  const Banner = () => {
  return (
    <StyledBanner>
        <StyledBannerContent className='banner'>
            <Container>
                <Typography
                variant="h2"
                    style={{
                        fontWeight: "bold",
                        marginBottom: 50,
                        fontFamily: "Montserrat",
                    }}
                >
                    Crypto Tracker
                </Typography>
                <Typography
                variant="subtitle2"
                style={{
                    colour: "darkgrey",
                    textTransform: "capitalize",
                    fontFamily: "Montserrat",
                    marginTop: -20,
                }}
                >
                    All the information you need on Crypto Currencies, highlighting an increase or decrease in its value! 
                </Typography>
                <div style={{ height: 50 }} /> {/*space between subtitle and carousel*/}
                <Carousel />
            </Container>
           
        </StyledBannerContent> 
    </StyledBanner>
  );
};

export default Banner;
