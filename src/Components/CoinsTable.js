import React, { useState, useEffect } from 'react';
import { CoinList } from '../config/api';
import { useCrypto } from '../CryptoContext';
import axios from 'axios';
import { ThemeProvider, Typography, createTheme, Container, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { numberWithCommas } from './Banner/Carousel';
import { styled } from '@mui/system';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'black',
  fontWeight: 700,
  fontFamily: 'Montserrat',
  '& img': {
    marginRight: '10px', 
    marginBottom: '5px', 
    height: '30px', 
  },
  '& div': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: "#16171a",
    cursor: "pointer",
    '&:hover': {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat"
  }));
  //page button styling
  const PageControl = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
    '& button': {
      border: 'none',
      borderRadius: '5px',
      padding: '8px 16px',
      fontFamily: 'Montserrat',
      cursor: 'pointer',
      backgroundColor: 'gold',
      color: 'black',
      fontWeight: 550,
      '&:hover': {
        backgroundColor: 'darkgoldenrod',
      },
      '&:disabled': {
        backgroundColor: 'lightgray',
        cursor: 'not-allowed',
      },
      '&:first-child': {
        marginRight: '8px',
      },
    },
  });
  


const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { currency, symbol } = useCrypto();

  //Function to fetch the coins and destructure data
  const fetchCoins = async (currency, setCoins, setLoading) => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
  
      // Store data in localStorage for caching
      localStorage.setItem('cachedCoinsData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if data is available in localStorage
    const cachedCoinsData = localStorage.getItem('cachedCoinsData');
    if (cachedCoinsData) {
      setCoins(JSON.parse(cachedCoinsData));
      setLoading(false);
    } else {
      fetchCoins(currency, setCoins, setLoading);
    }
  }, [currency, setLoading]);

  //Function to filter coins based on search
  const handleSearch = () => {
    const filteredCoins = coins.filter(
      (coin) =>
        coin.name &&
        coin.symbol &&
        (coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase()))
    );
  
    return search ? filteredCoins : coins;
  };

// pagenation
const pageCount = Math.ceil(handleSearch().length / itemsPerPage);

  const changePage = (newPage) => {
    setPage(newPage);
  };

  // Styling below banner
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: 'center' }}>
        <Typography variant="h4" style={{ margin: 18, fontFamily: 'Montserrat' }}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label="Search for a Crypto Currency.."
          variant="outlined"
          style={{ marginBottom: 20, width: '100%' }}
          InputProps={{
            style: { color: 'white' }, // Change the color of the text
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>
          <Table>
            <TableHead style={{ backgroundColor: '#EEBC1D' }}>
              <TableRow>
                {['Coin', 'Price', '24h Change', 'Market Cap'].map((head) => (
                  <StyledTableCell
                    key={head}
                    align={head === 'Coin' ? '' : 'right'}
                  >
                    {head}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch()
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((row) => {
                const profit = row.price_change_percentage_24h > 0;
                return (
                  <StyledTableRow
                    key={row.name}
                    onClick={() => navigate(`/coins/${row.id}`)}
                  >
                    <StyledTableCell>
                      <img
                        src={row?.image}
                        alt={row.name}
                        height="50"
                        style={{ marginBottom: 10 }}
                      />
                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column" 
                        }}>
                        <span style={{ 
                            textTransform: "uppercase", 
                            fontSize: 22 
                        }}>
                          {row.symbol}
                        </span>
                        <span style={{ 
                            color: "darkgrey" 
                            }}>
                                {row.name}
                            </span>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{
                      color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                      fontWeight: 500,
                    }}>
                      {profit && "+"}
                      {row.price_change_percentage_24h.toFixed(2)}%
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {symbol} {numberWithCommas(row.market_cap.toString().slice(0, -6))} M
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/*next page button styling*/}
        <PageControl>
          <Typography>Page: {page}</Typography>
          <button onClick={() => changePage(page - 1)} disabled={page === 1}>
            Prev
          </button>
          <button onClick={() => changePage(page + 1)} disabled={page === pageCount}>
            Next
          </button>
        </PageControl>
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
