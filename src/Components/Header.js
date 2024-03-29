import React from 'react';
import {
  AppBar,
  Typography,
  Container,
  Toolbar,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useCrypto } from '../CryptoContext'; 
import AuthModal from './Authentication/AuthModal';
import UserSidebar from "./Authentication/UserSidebar";

const StyledAppBar = styled(AppBar)({
  '& .MuiTypography-root': {
    flex: 1,
    color: 'gold',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
});

const Header = () => {
  const navigate = useNavigate();
  const { currency, setCurrency, user } = useCrypto();

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setCurrency(selectedCurrency);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledAppBar color="transparent" position="static" component="div">
        <Container>
          <Toolbar>
            <Typography onClick={() => navigate('/')} variant="h6">
              Crypto Tracker
            </Typography>
            <select
              variant="outlined"
              style={{
                width: 100,
                height: 40,
                marginRight: 15,
                backgroundColor: darkTheme.palette.background.default,
                color: darkTheme.palette.text.primary,
                border: `1px solid ${darkTheme.palette.divider}`,
                borderRadius: 4,
                padding: '8px 12px',
              }}
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value={'USD'}>USD</option>
              <option value={'ZMW'}>ZMW</option>
            </select>
            {user ? <UserSidebar /> : <AuthModal/>}
          </Toolbar>
        </Container>
      </StyledAppBar>
    </ThemeProvider>
  );
};

export default Header;
