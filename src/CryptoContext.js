import React, { createContext, useEffect, useState, useContext } from 'react';

export const CryptoContext = createContext(); // Change the export here

export const CryptoProvider = ({ children }) => { // Renamed CryptoContext to CryptoProvider
  const [currency, setCurrency] = useState('USD');
  const [symbol, setSymbol] = useState('$');

  useEffect(() => {
    if (currency === 'ZAR') setSymbol('R');
    else if (currency === 'USD') setSymbol('$');
  }, [currency]);

  return (
    <CryptoContext.Provider value={{ currency, symbol, setCurrency }}>
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

export default CryptoProvider; // Export CryptoProvider as default
