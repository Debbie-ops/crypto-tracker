import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Components/Header';
import Homepage from './Pages/Homepage';
import CoinPage from './Pages/CoinPage';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Alert from './Components/Alert';

// Create a styled component for the App container
const CustomStyledComponent = styled(Box)({
  backgroundColor: "#14161a",
  color: "white",
  minHeight: "100vh",
});
//page navigation
function App() {
  return (
    <BrowserRouter>
      <CustomStyledComponent>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} exact />
          <Route path="/coins/:id" element={<CoinPage />} />
        </Routes>
      </CustomStyledComponent>
      <Alert/>
    </BrowserRouter>
  );
}

export default App;
