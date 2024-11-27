'use client'
// contexts/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import dotenv from "dotenv"
dotenv.config()
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWallets = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/wallets`);
      if (res.data.success) {
        setWallets(res.data.wallets);
      } else {
        console.error('Failed to fetch wallets:', res.data.error);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const generateWallets = async (num) => {
     console.log('log->num', num)
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/generate-wallets`, {
        num: num
      });
      console.log('log->res', res)
      if (res.data.success) {
        await fetchWallets(); // Refresh wallet list
      } else {
        console.error('Failed to generate wallet:', res.data.error);
      }
    } catch (error) {
      console.error('Error generating wallet:', error);
    }
    setLoading(false);
  };

  const importWallets = async (pk) => {
    console.log('log->import', pk);
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/import-wallets`, {
        privateKeys: [pk]
      });
      console.log('log->res', res)
      if (res.data.success) {
        await fetchWallets(); // Refresh wallet list
      } else {
        console.error('Failed to import wallet:', res.data.error);
      }
    } catch (error) {
      console.error('Error importing wallet:', error);
    }
    setLoading(false);
  }

  const removeWallets = async (wallets) => {
    // console.log('log->wallets', wallets)
   setLoading(true);
   try {
     const res = await axios.post(`${backendURL}/api/remove-wallets`, {
       publicKeys: wallets
     });
     console.log('log->res', res)
     if (res.data.success) {
       await fetchWallets(); // Refresh wallet list
     } else {
       console.error('Failed to remove wallets:', res.data.error);
     }
   } catch (error) {
     console.error('Error removing wallets:', error);
   }
   setLoading(false);
 };
 
  return (
    <WalletContext.Provider
      value={{ wallets, loading, generateWallets, importWallets, removeWallets }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);

export const spiltSol = async(selectedWallets, solAmounts, adminPk, tipAmount) => {
  // setLoading(true);
  try {
    const res = await axios.post(`${backendURL}/api/spilt-sol`, {
      selectedWallets,
      solAmounts,
      adminPk,
      tipAmount
    });
    console.log('log->spiltSol res', res)
    if (res.data.success) {
      await fetchBalances(); // Refresh wallet list
    } else {
      console.error('Failed to spilt sol:', res.data.error);
    }
  } catch (error) {
    console.error('Error spilting sols:', error);
  }
  setLoading(false);
}

export const gatherSol = async(selectedWallets, targetWallet, adminPk, tipAmount) => {
  // setLoading(true);
  try {
    const res = await axios.post(`${backendURL}/api/collect-sol`, {
      selectedWallets,
      targetWallet,
      adminPk,
      tipAmount
    });
    console.log('log->gatherSol res', res)
    if (res.data.success) {
      await fetchBalances(); // Refresh wallet list
    } else {
      console.error('Failed to collect sol:', res.data.error);
    }
  } catch (error) {
    console.error('Error collecting sol:', error);
  }
  setLoading(false);
}

export const createAndBuy = async(selectedWallets, adminPk, tipAmount) => {
  // setLoading(true);
  try {
    const res = await axios.post(`${backendURL}/api/create-buy`, {
      selectedWallets,
      adminPk,
      tipAmount
    });
    console.log('log->createAndBuy res', res)
    if (res.data.success) {
      await fetchBalances(); // Refresh wallet list
    } else {
      console.error('Failed to create and buy:', res.data.error);
    }
  } catch (error) {
    console.error('Error creating and buying:', error);
  }
  setLoading(false);
}

export const sell = async(selectedWallets, tokenMint, adminPk, tipAmount, isPump) => {
  try {
    const res = await axios.post(`${backendURL}/api/sell`, {
      selectedWallets,
      tokenMint,
      adminPk,
      tipAmount,
      isPump
    });
    console.log('log->sell res', res)
    if (res.data.success) {
      await fetchBalances(); // Refresh wallet list
    } else {
      console.error('Failed to sell tokens:', res.data.error);
    }
  } catch (error) {
    console.error('Error selling tokens:', error);
  }
  setLoading(false);
}

export const gatherTokens = async(selectedWallets, tokenMint, targetWallet, adminPk, tipAmount) => {
  try {
    const res = await axios.post(`${backendURL}/api/collect-token`, {
      selectedWallets,
      tokenMint,
      targetWallet,
      adminPk,
      tipAmount
    });
    console.log('log->gatherTokens res', res)
    if (res.data.success) {
      await fetchBalances(); // Refresh wallet list
    } else {
      console.error('Failed to collect tokens:', res.data.error);
    }
  } catch (error) {
    console.error('Error collecting tokens:', error);
  }
  setLoading(false);
}