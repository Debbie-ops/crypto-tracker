import React, { createContext, useEffect, useState, useContext } from 'react';
//import axios from 'axios';
import { auth, db } from './firebase';
import { onSnapshot, doc } from "@firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";

export const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [symbol, setSymbol] = useState('$');
  const [usdToKwachaRate, setUsdToKwachaRate] = useState(25.75); // manual conversion
  const [user, setUser] = useState(null);
  const [alert, setAlert ] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          console.log(coin.data().coins);
          setWatchlist(coin.data().coins);
        } else {
          console.log("No Items in Watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);


  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) setUser(user);
      else setUser(null);

      console.log(user);
    });
  }, [])

  useEffect(() => {
    if (currency === 'ZMW') {
      setSymbol('K');
      setUsdToKwachaRate(25.75); // Manually set the conversion rate to Kwacha (ZMW)
    } else if (currency === 'USD') {
      setSymbol('$');
    } else {
      setSymbol('?');
    }
  }, [currency]);

  

  return (
    <CryptoContext.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        usdToKwachaRate,
        alert,
        setAlert,
        user,
        watchlist,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};

export default CryptoProvider;
