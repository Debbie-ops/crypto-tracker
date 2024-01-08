import { styled } from '@mui/system';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import { Button, Tab, Tabs, AppBar } from '@mui/material';
import Signup from './Signup';
import Login from './Login';
import { useState } from 'react';
import { useCrypto } from '../../CryptoContext';
import { auth } from '../../firebase';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

const CustomModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Paper = styled('div')(({ theme }) => ({
  width: 400,
  backgroundColor: theme.palette.background.paper,
  color: 'white',
  borderRadius: 10,
}));

const GoogleContainer = styled('div')(({ theme }) => ({
  padding: 24,
  paddingTop: 0,
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  gap: 20,
  fontSize: 20,
}));

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const { setAlert } = useCrypto();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => setValue(newValue);
//google signing in
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Sign Up Successful. Welcome ${res.user.email}`,
          type: 'success',
        });
        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: 'error',
        });
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{
          width: 85,
          height: 40,
          marginLeft: 15,
          backgroundColor: '#EEBC1D',
        }}
        onClick={handleOpen}
      >
        Login
      </Button>
      <CustomModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper>
            <AppBar position="static" style={{ backgroundColor: 'transparent', color: 'white' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup handleClose={handleClose} />}
            <GoogleContainer>
              <span>OR</span>
              <GoogleButton
                style={{ width: '100%', outline: 'none' }}
                onClick={signInWithGoogle}
              />
            </GoogleContainer>
          </Paper>
        </Fade>
      </CustomModal>
    </div>
  );
}
