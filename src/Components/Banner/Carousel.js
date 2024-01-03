import React, { useEffect } from 'react';
//import { styled } from '@mui/system';
import axios from 'axios';
//import { TrendingCoins } from '../../config/api';
import { useCrypto } from '../../CryptoContext'; 
import { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';


//carousel specs
//const StyledCarousel = styled('div')({
  //height: '50%', 
  //display: 'flex',
  //alignItems: 'center',
//},

//);

//REGEX to break number into commas
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//carousel movement specs
const Classes = {
  carouselItem: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    margin: '10px 0',
    textAlign: 'center',
  },
};

//getting from api endpoint
const Carousel = () => {
  const [trendingData, setTrendingData] = useState([]);
  const {  symbol } = useCrypto();

//caching logic
useEffect(() => {
  const fetchData = async () => {
    try {
      //check if data is available in localStorage
      const cachedData = localStorage.getItem('cachedData');
      if (cachedData) {
        setTrendingData(JSON.parse(cachedData));
      } else {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`);
        setTrendingData(response.data);

        //store data in localStorage for caching
        localStorage.setItem('cachedData', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

  //initial data fetching 
  //const fetchTrendingCoins = async (currency) => {
    //try {
      //const { data } = await axios.get(TrendingCoins(currency));
      //return data;
    //} catch (error) {
      //console.error('Error fetching trending coins:', error);
      //return [];
    //}
  //};
//fetching using setupProxy
  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`)
      .then(res => {
        setTrendingData(res.data);
      })
      .catch(error => console.log(error));
  }, []);

  console.log('Trending Data:', trendingData);

//call actual coins and price from coin gecko with profit logic to display 
const items = trendingData.map((coin) => {
  let profit = coin.price_change_percentage_24h >= 0;

  return (
    <Link 
      className={Classes.carouselItem} 
      to={`/coins/${coin.id}`} 
      key={coin.id}
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white'}}
    >
      <img 
        src={coin?.image}
        alt={coin.name}
        height="80"
        style={{ marginBottom: 10 }}
      /> 
      <span>
        {coin?.symbol}&nbsp;
        <span   
        style={{
          color: profit > 0 ? "rgb(14, 203, 129)" : "red",
          fontWeight: 500,
        }}>
            <>
              {profit ? "+" : "-"}{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </>
        </span>
      </span>
      
      <span style={{ fontSize: 22, fontWeight: 500 }}>
        {symbol} {coin?.current_price && numberWithCommas(parseFloat(coin.current_price).toFixed(2))}
      </span>
    </Link>
  );
});

//more carousel movement
  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <AliceCarousel
    mouseTracking
    infinite
    autoPlayInterval={1000}
    animationDuration={1500}
    disableDotsControls
    //disableButtonControls
    responsive={responsive}
    autoPlay
    items={items}
    
    >
      
    </AliceCarousel>
  );
};

export default Carousel;