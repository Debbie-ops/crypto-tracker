import React, { useState, useEffect, useRef } from 'react';
import { useCrypto } from '../CryptoContext';
import { HistoricalChart } from '../config/api';
import axios from 'axios';
import { CircularProgress, ThemeProvider, styled, createTheme } from '@mui/material';
import Chart from 'chart.js/auto'; // Import Chart.js
import SelectButton from './SelectButton';
import { chartDays } from '../config/data';

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);
  const { currency } = useCrypto();
  const [flag, setFlag] = useState(false);

  const chartContainer = useRef(null); // Ref for the chart container

  const fetchHistoricData = async () => {
    const cacheKey = `historicData_${coin.id}_${days}_${currency}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      setFlag(true);
      setHistoricData(JSON.parse(cachedData));
    } else {
      try {
        const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
        setFlag(true);
        setHistoricData(data.prices);
        localStorage.setItem(cacheKey, JSON.stringify(data.prices));
      } catch (error) {
        console.error('Error fetching historic data:', error);
      }
    }
  };

  useEffect(() => {
    fetchHistoricData();
  }, [coin.id, days, currency]);

  useEffect(() => {
    let chartInstance = null;

    if (chartContainer.current && historicData.length > 0) {
      chartInstance = new Chart(chartContainer.current, {
        type: 'line',
        data: {
          labels: historicData.map((coin) => {
            const date = new Date(coin[0]);
            const time =
              date.getHours() > 12
                ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                : `${date.getHours()}:${date.getMinutes()} AM`;
            return days === 1 ? time : date.toLocaleDateString();
          }),
          datasets: [
            {
              data: historicData.map((coin) => coin[1]),
              label: `Price ( Past ${days} Days ) in ${currency}`,
              borderColor: '#EEBC1D',
            },
          ],
        },
        options: {
          elements: {
            point: {
              radius: 1,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [historicData, days, currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });

  const Container = styled('div')(({ theme }) => ({
    width: '75%',
    height: '400px',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  }));

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        {!historicData || !flag ? (
          <CircularProgress style={{ color: 'gold' }} size={250} thickness={1} />
        ) : (
          <>
            <canvas ref={chartContainer} />
            <div
              style={{
                display: 'flex',
                marginTop: 20,
                justifyContent: 'space-around',
                width: '100%',
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default CoinInfo;
