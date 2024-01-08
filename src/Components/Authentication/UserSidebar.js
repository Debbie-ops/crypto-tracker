import React from 'react';
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { Avatar, Button } from '@mui/material';
import { useCrypto } from '../../CryptoContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { AiFillDelete } from 'react-icons/ai';
import { doc, setDoc } from 'firebase/firestore';

export default function UserSidebar() {
  const [state, setState] = useState({ right: false });
  const { user, setAlert, watchlist, coins, symbol } = useCrypto();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: 'success',
      message: 'Logout Successful!',
    });

    toggleDrawer();
  };

  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, 'watchlist', user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist!`,
        type: 'success',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: 'error',
      });
    }
  };

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              cursor: 'pointer',
              backgroundColor: '#EEBC1D',
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div
              style={{
                width: 350,
                padding: 25,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'monospace',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  height: '92%',
                }}
              >
                <Avatar
                  style={{
                    width: 200,
                    height: 200,
                    cursor: 'pointer',
                    backgroundColor: '#EEBC1D',
                    objectFit: 'contain',
                  }}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className="watchlist">
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    Watchlist
                  </span>
                  {coins &&
                  coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return (
                        <div className="coin" key={coin.id}>
                          <span>{coin.name}</span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}{" "}
                            {coin.current_price.toFixed(2)}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </span>
                        </div>
                      );
                    else return <></>;
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                style={{
                  height: '8%',
                  width: '100%',
                  backgroundColor: '#EEBC1D',
                  marginTop: 20,
                }}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
