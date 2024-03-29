import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCrypto } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import { styled } from '@mui/system';
import CoinInfo from '../Components/CoinInfo';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Button, LinearProgress, Typography } from '@mui/material';
import { numberWithCommas } from '../Components/Banner/Carousel';
import HtmlReactParser from 'html-react-parser';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CoinPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, setAlert, watchlist } = useCrypto();

  // caching logic created
  const fetchCoin = useCallback(async () => {
    try {
      const cachedCoinData = localStorage.getItem(`coin_${id}`);
      if (cachedCoinData) {
        setCoin(JSON.parse(cachedCoinData));
      } else {
        const { data } = await axios.get(SingleCoin(id));
        setCoin(data);
        localStorage.setItem(`coin_${id}`, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching coin:', error);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCoin();
    };
    fetchData();
  }, [fetchCoin, id]);
  

  const Sidebar = styled('div')`
    width: 350px;
    padding: 10px;
    text-align: justify;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;
    border-right: 2px solid grey;
    margin-right: 50px;
    span {
      display: flex;
      margin-bottom: 10px;
     
    }

    ${theme.breakpoints.down('sm')} {
      span {
        flex-direction: column;
        align-items: flex-start;
      }
      .heading {
        margin-bottom: 5px;
      }
    }
    ${theme.breakpoints.down('xs')} {
      span {
        margin-bottom: 15px;
      }
    }
    .heading {
      font-weight: bold;
      margin-right: 10px;
      font-family: Montserrat;
    }
    .content {
      font-family: Montserrat;
    }
  `;

  //add to watchlist connecting to firebase
  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  if (!coin) return <LinearProgress style={{ backgroundColor: 'gold' }} />;

  const rank = coin?.market_cap_rank || 'N/A';
  const currentPrice = coin?.market_data?.current_price?.[currency.toLowerCase()] || 'N/A';
  const marketCap = coin?.market_data?.market_cap?.[currency.toLowerCase()]?.toString().slice(0, -6) || 'N/A';

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar>
        <Typography variant="h3" className="heading">
          {coin?.name || 'N/A'}
        </Typography>
        <Typography variant="subtitle1">
          {HtmlReactParser(coin?.description?.en?.split('. ')[0]) || 'N/A'}.
        </Typography>
        <div>
          <span>
            <Typography variant="h5" className="heading">
              Rank:
            </Typography>
            <Typography variant="h5" className="content">
              {rank}
            </Typography>
          </span>
          <span>
            <Typography variant="h5" className="heading">
              Current Price:
            </Typography>
            <Typography variant="h5" className="content">
              {symbol} {numberWithCommas(currentPrice)}
            </Typography>
          </span>
          <span>
            <Typography variant="h5" className="heading">
              Market Cap:
            </Typography>
            <Typography variant="h5" className="content">
              {symbol} {numberWithCommas(marketCap)}
            </Typography>
          </span>

          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D"
              }}
              onClick={inWatchlist? removeFromWatchlist: addToWatchlist}
            > 
            {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </Sidebar>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;
