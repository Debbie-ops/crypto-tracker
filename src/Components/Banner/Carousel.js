import React, { useEffect } from 'react';
import axios from 'axios';
import { useCrypto } from '../../CryptoContext'; 
import { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

// REGEX to break number into commas
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Classes = {
  carouselItem: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    margin: '10px 0',
    textAlign: 'center',
  },
};

const Carousel = () => {
  const [trendingData, setTrendingData] = useState([]);
  const { currency, symbol, usdToKwachaRate } = useCrypto();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`);
        setTrendingData(response.data);
        localStorage.setItem('cachedData', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const cachedData = localStorage.getItem('cachedData');
    if (cachedData) {
      setTrendingData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, [currency]);

  const items = trendingData.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;
    const priceInKwacha = (parseFloat(coin.current_price) * usdToKwachaRate).toFixed(2);

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
          {symbol} {priceInKwacha && numberWithCommas(priceInKwacha)}
        </span>
      </Link>
    );
  });

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
      responsive={responsive}
      autoPlay
      items={items}
    />
  );
};

export default Carousel;
