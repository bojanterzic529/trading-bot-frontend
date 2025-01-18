'use client'
// contexts/BotContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import dotenv from "dotenv"
import { useAuth } from './AuthContext';
dotenv.config()
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const { userData, loading: authLoading } = useAuth();
  const [symbols, setSymbols] = useState([]);
  const [status, setStatus] = useState({});
  const [balances, setbalances] = useState([]);
  const [prices, setPrices] = useState([]);
  const [history, setHistory] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/status`);
      if (res.data) {
        setStatus(res.data);
      } else {
        console.error('Failed to fetch Bot Status:', res.data);
      }
    } catch (error) {
      console.error('Error fetching Bot Status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSymbols = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/symbols`);
      if (res.data) {
        setSymbols(res.data);
      } else {
        console.error('Failed to fetch Symbols:', res.data);
      }
    } catch (error) {
      console.error('Error fetching Symbols:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/balance`);
      if (res.data) {
        setbalances(res.data);
      } else {
        console.error('Failed to fetch Balances:', res.data);
      }
    } catch (error) {
      console.error('Error fetching Balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/history`);
      if (res.data) {
        setHistory(res.data);
      } else {
        console.error('Failed to fetch History:', res.data);
      }
    } catch (error) {
      console.error('Error fetching History:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/api/trades`);
      if (res.data) {
        setTrades(res.data);
      } else {
        console.error('Failed to fetch Trades:', res.data);
      }
    } catch (error) {
      console.error('Error fetching Trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price`);
      const data = await res.json();
      if (data) {
        setPrices(data);
      } else {
        console.error('Failed to fetch Prices:', data);
      }
    } catch (error) {
      console.error('Error fetching Prices:', error);
    } finally {
      setLoading(false);
    }
  }

  const startBot = async (params) => {
    console.log('log->start params', params);
    const res = await axios.post(`${backendURL}/api/start`, params);
    console.log('log->start res', res)
    fetchStatus();
    return res.data;
  }

  const stopBot = async () => {
    const res = await axios.get(`${backendURL}/api/stop`);
    fetchStatus();
    return res.data;
  }

  const clearHistory = async () => {
    const res = await axios.get(`${backendURL}/api/delete/history`);
    fetchStatus();
    return res.data;
  }

  const clearCache = async () => {
    const res = await axios.get(`${backendURL}/api/delete/cache`);
    fetchStatus();
    return res.data;
  }


  const restartBot = async (params) => {
    console.log('log->restart params', params);
    try {
      const res = await axios.post(`${backendURL}/api/restart`, params);
      console.log('log->restart res', res)
      if (res.data.success) {

      } else {
        console.error('Failed to restart Bot:', res.data);
      }
    } catch (error) {
      console.error('Error restart Bot:', error);
    } finally {
      fetchStatus();
    }
  }

  const setOption = async (params) => {
    console.log('log->set params', params);
    const res = await axios.post(`${backendURL}/api/setOption`, params);
    console.log('log->start res', res)
    fetchStatus();
    fetchSymbols();
    fetchBalances();
    fetchHistory();
    fetchTrades();
    return res.data;
  }

  useEffect(() => {
    console.log('log->useEffect')
    // setInterval(() => {
    //   fetchStatus();
    //   fetchBalances();
    // }, 60000);
    if (userData) {
      fetchSymbols();
      fetchStatus();
      fetchBalances();
      fetchHistory();
      fetchPrices();
      fetchTrades();
    }
  }, [userData]);

  return (
    <BotContext.Provider
      value={{ status, loading, symbols, balances, history, trades, prices, startBot, stopBot, restartBot, clearHistory, clearCache, setOption, fetchHistory, fetchTrades, fetchBalances, fetchPrices, fetchStatus }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBotContext = () => useContext(BotContext);
