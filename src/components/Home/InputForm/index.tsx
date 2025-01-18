import { useWalletContext } from "../../../contexts/WalletContext";
import { SiSolana } from "react-icons/si";
import { FaBrush, FaDatabase } from "react-icons/fa";
import { IoIosDownload, IoMdRefresh } from "react-icons/io";
import { AiFillPlusCircle, AiFillMinusCircle, AiOutlinePlayCircle, AiOutlineStop } from "react-icons/ai";
import validator from "@/lib/validator";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import CustomCheckbox from "../WalletTable/CustomCheckbox";
import { useBotContext } from "@/contexts/BotContext";
import { Chip } from "@mui/material"
import { cn } from "@/lib/utils";

const INIT_PAIRS = [
  'BTCUSDC', 'ETHUSDC', 'BNBUSDC', 'SOLUSDC', 'DOGEUSDC', 'PEPEUSDC'
]

interface PAIR_INFO {
  exchange: String;
  timeFrame: String;
  symbol: String;
  strategy: String;
  stopLoss: String;
  takeProfit: String;
}

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function InputForm({ }: any) {

  const [showModal, setShowModal] = useState(false);

  const [exchange, setExchange] = useState('mexc');
  // const [apikey, setApikey] = useState('');
  // const [apiSecretkey, setApiSecretkey] = useState('');
  const [authkey, setAuthkey] = useState('');
  const [pair, setPair] = useState('');
  const [pairs, setPairs] = useState<PAIR_INFO[]>([]);
  const [strategy, setStrategy] = useState('ema');
  const [fastLength, setFastLength] = useState('9')
  const [slowLength, setSlowLength] = useState('20');
  const [positionSize, setPositionSize] = useState('1000');
  const [useTimeLimit, setUseTimeLimit] = useState(true);
  const [timeLimit, setTimeLimit] = useState('24');
  const [tpPercent, setTpPercent] = useState('0.5');
  const [slPercent, setSlPercent] = useState('0.5');
  const [stopLoss, setStopLoss] = useState('no');
  const [takeProfit, setTakeProfit] = useState('no');
  const [maxLoss, setMaxLoss] = useState('1000');
  const [timeFrame, setTimeFrame] = useState('1');

  const {
    status,
    symbols,
    balances,
    trades,
    prices,
    startBot,
    stopBot,
    restartBot,
    setOption,
    clearCache,
    clearHistory,
    loading,
    fetchTrades,
    fetchBalances,
    fetchStatus,
    fetchPrices
  } = useBotContext();
  useEffect(() => {
    const data = status.storageData;
    if (!data) return;
    console.log('setting')
    setPair(data.pair);
    setFastLength(data.fastLength);
    setSlowLength(data.slowLength);
    setPositionSize(data.amount);
    setTimeFrame(data.timeFrame);
    setTimeLimit(data.timeLimit ? (data.timeLimit / (3600 * 1000)).toString() : '')
    setPairs(data.pairs);
    setExchange(data.exchange)
  }, [status?.storageData?.fastLength, status?.storageData?.slowLength, status?.storageData?.amount, status?.storageData?.timeFrame, status?.storageData?.pairs?.length])

  // useEffect(() => {
  //   setApikey(localStorage.getItem('apiKey') ?? '');
  //   setApiSecretkey(localStorage.getItem('apiSecret') ?? '');
  // }, [])

  const handleStart = () => {
    const params: Record<string, any> = {
      // apiKey: apikey,
      // apiSecret: apiSecretkey,
      exchange,
      authkey,
      pair,
      pairs,
      strategy,
      fastLength,
      slowLength,
      amount: positionSize,
      stopLoss,
      takeProfit,
      timeFrame,
      timeLimit: isNaN(Number(timeLimit)) ? 1 * 3600 * 1000 : Number(timeLimit) * 3600 * 1000,
      maxLoss,
      slPercent,
      tpPercent,
    };
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const element: string = params[key];
        if (element == status.storageData[key] || element == '' || !element) delete params[key];
      }
    }
    console.log(params)
    startBot(params).then((response: any) => {
      if (response?.success) toast.success('Bot is started');
      else toast.warn('Starting bot is failed');
    })
  }

  const handleStop = () => {
    stopBot().then((response: any) => {
      if (response?.success) toast.success('Bot is stopped');
      else toast.warn('Stopping bot is failed');
    })
  }

  const handleClearHistory = () => {
    clearHistory().then((response: any) => {
      if (response?.acknowledged) toast.success('History is cleared');
      else toast.warn('Clearing history is failed');
    })
  }

  const handleClearCache = () => {
    clearCache().then((response: any) => {
      if (response?.success) toast.success('Cache is cleared');
      else toast.warn('Clearing cache is failed');
    })
  }

  const handleExchangeSelect = (newVal: string) => {
    const params = {
      exchange: newVal
    }
    setOption(params).then((response: any) => {
      if (response?.success) toast.success('Exchange is set');
      else toast.warn('Setting exchange is failed');
    })
  }

  // console.log('debug history', history)
  return (
    <>
      <div className="mb-6 mt-4">
        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold uppercase">Exchange</label>
            <select
              value={exchange}
              onChange={(e) => {setExchange(e.target.value); handleExchangeSelect(e.target.value)}}
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            >
              <option value="binance">Binance</option>
              <option value="bybit">Bybit</option>
              <option value="mexc">MEXC</option>
            </select>
          </div>
          <div className="flex flex-col justify-between">
            <label></label>
            <button
              className="bg-background-light  text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase"
              onClick={() => { fetchBalances(); setShowModal(true); }}>
              Balance
            </button>
          </div>
        </div>
        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
          {/* <div>
            <label className="text-sm font-semibold uppercase">
              API KEY <span className="text-foreground">*</span>
            </label>
            <input
              type="password"
              value={apikey}
              onChange={(e) => { setApikey(e.target.value); localStorage.setItem('apiKey', e.target.value) }}
              placeholder="Enter API Key"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold uppercase">
              API SECURITY KEY <span className="text-foreground">*</span>
            </label>
            <input
              type="password"
              value={apiSecretkey}
              onChange={(e) => { setApiSecretkey(e.target.value); localStorage.setItem('apiSecret', e.target.value) }}
              placeholder="Enter Private Key"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div> */}
          {/* <div>
            <label className="text-sm font-semibold uppercase">
              Authorization Key <span className="text-foreground">*</span>
            </label>
            <input
              type="text"
              value={authkey}
              onChange={(e) => setAuthkey(e.target.value)}
              placeholder="Enter Authorization Key"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div> */}
          {/* <div>
            <label className="text-sm font-semibold uppercase">
              Jito Tip Amount(Sol) <span className="text-foreground">*</span>
            </label>
            <input
              type="text"
              value={jitoTipAmount}
              onChange={(e) => setJitoTipAmount(e.target.value)}
              placeholder="Enter jito tip amount"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div> */}
        </div>

        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold uppercase">Pair</label>
            <select
              value={"SELECT PAIR"}
              onChange={(e) => { setPairs(pairs.filter(p => p.symbol == e.target.value).length > 0 ? pairs : pairs.concat({ symbol: e.target.value, exchange, timeFrame, strategy, stopLoss, takeProfit })) }}
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            >
              <option value={'SELECT PAIR'}>--SELECT PAIR--</option>
              {
                (symbols?.length > 0 ? symbols : INIT_PAIRS).sort().map((p: string) => {
                  return (<option key={p} value={p}>{p}</option>)
                })
              }
            </select>
          </div>
          <div key="pairs" className="flex mt-8">
            {
              pairs.map((e) => (
                <Chip key={`${e.exchange}:${e.symbol}:${e.timeFrame}m`} label={`${e.exchange}:${e.symbol}:${e.timeFrame}m`} variant="outlined" style={{ color: "rgb(255 255 255 / 0.65)" }} onDelete={() => { setPairs(pairs.filter(p => p != e)) }}></Chip>
              ))
            }
          </div>
        </div>

        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
        <div>
            <label className="text-sm font-semibold uppercase ml-2">
              Time Frame
            </label>
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            >
              <option value="1">1m</option>
              <option value="2">2m</option>
              <option value="3">3m</option>
              <option value="5">5m</option>
              <option value="10">10m</option>
              <option value="15">15m</option>
              <option value="30">30m</option>
              <option value="45">45m</option>
              <option value="60">60m</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold uppercase">Strategy</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            >
              <option value="ema">EMA</option>
              <option value="bollinger">Bollinger Band</option>
            </select>
          </div>
          {
            strategy == "ema" && (
              <>
                <div>
                  <label className="text-sm font-semibold uppercase">
                    Fast EMA Length <span className="text-foreground">*</span>
                  </label>
                  <input
                    type="text"
                    value={fastLength}
                    onChange={(e) => setFastLength(e.target.value)}
                    placeholder="Enter Fast EMA Length"
                    className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold uppercase">
                    Slow EMA Length <span className="text-foreground">*</span>
                  </label>
                  <input
                    type="text"
                    value={slowLength}
                    onChange={(e) => setSlowLength(e.target.value)}
                    placeholder="Enter Slow EMA Length"
                    className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
                  />
                </div>
              </>
            )
          }
        </div>
        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold uppercase">Stop Loss</label>
            <select
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            >
              <option value="no">No</option>
              <option value="atr">ATR</option>
              <option value="trailing">Trailing</option>
              <option value="static">Static</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold uppercase ml-2">
              Stop Loss Percent
            </label>
            <input
              type="text"
              value={slPercent}
              onChange={(e) => setSlPercent(e.target.value)}
              disabled={stopLoss != "static"}
              placeholder="Enter Stop Loss Percent"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div>
        </div>
        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold uppercase">Take Profit</label>
            <select
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            >
              <option value="no">No</option>
              <option value="atr">ATR</option>
              <option value="trailing">Trailing</option>
              <option value="static">Static</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold uppercase ml-2">
              Take Profit Percent
            </label>
            <input
              type="text"
              value={tpPercent}
              onChange={(e) => setTpPercent(e.target.value)}
              disabled={takeProfit != "static"}
              placeholder="Enter Take Profit Percent"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div>
        </div>
        <div className="text-base font-semibold uppercase text-foreground">-------------------------------------   Trading Setting   -----------------------------------------</div>
        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold uppercase">
              Position Size (<span className="text-foreground">$</span>)
            </label>
            <input
              type="text"
              value={positionSize}
              onChange={(e) => setPositionSize(e.target.value)}
              placeholder="Enter Position Size"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold uppercase">
              Max Daily Loss (<span className="text-foreground">$</span>)
            </label>
            <input
              type="text"
              value={maxLoss}
              onChange={(e) => setMaxLoss(e.target.value)}
              placeholder="Enter Max Daily Loss"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div>
        </div>
        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            {/* <div className=""> */}
            {/* <CustomCheckbox checked={useTimeLimit} onChange={() => setUseTimeLimit(!useTimeLimit)}></CustomCheckbox> */}
            <label className="text-sm font-semibold uppercase ml-2">
              Trade Time Limit (<span className="text-foreground">hour</span>)
            </label>
            {/* </div> */}
            <input
              type="text"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              disabled={!useTimeLimit}
              placeholder="Enter Time Limit of one Trade"
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            />
          </div>



        </div>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div className="flex gap-5 items-center p-2 rounded-md">
            {/* <div className="text-sm font-semibold">
              Selected: <span className="text-white">{selectedWallets.size}</span>
            </div>
            <div className="text-sm font-semibold">
              Sol Balance: <span className="text-white">{totalBalance.sol}</span>
            </div>
            <div className="text-sm font-semibold">
              Token Balance: <span className="text-white">{totalBalance.token}</span>
            </div> */}
          </div>

          <div className="flex gap-4 flex-wrap items-center">
            {/* <button
            // onClick={generateWallet}
            className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase"
            disabled={loading}
          >
            <AiFillPlusCircle className="text-foreground text-lg" />
            {loading ? 'Generating...' : 'Generate Wallet'}
          </button> */}
            <button
              onClick={() => { fetchTrades(); fetchStatus(); fetchPrices(); }}
              className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase"
              disabled={loading}
            >
              <IoMdRefresh className="text-foreground text-lg" />
              Refresh
            </button>
            <button
              onClick={() => handleStart()}
              className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase"
              disabled={loading || status.storageData?.isRunning}
            >
              <AiOutlinePlayCircle className="text-foreground text-lg" />
              Start Bot
            </button>
            <button
              onClick={() => handleStop()}
              className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase"
              disabled={loading || !status.storageData?.isRunning}
            >
              <AiOutlineStop className="text-foreground text-lg" />
              Stop Bot
            </button>
            <button
              onClick={() => handleClearHistory()}
              className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase"
              disabled={loading}
            >
              <FaBrush className="text-foreground text-lg" />
              Clear History
            </button>
            <button
              onClick={() => handleClearCache()}
              className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase"
              disabled={loading}
            >
              <FaBrush className="text-foreground text-lg" />
              Clear Cache
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
        >
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#10102D] rounded-lg overflow-hidden shadow-xl max-w-lg w-full"
          >
            <div className="bg-[#18E299] uppercase px-4 py-3 text-white text-lg font-semibold">
              Wallet Balance
            </div>
            <div className="p-6">
              <table className="w-full text-sm min-w-[512px]">
                <thead>
                  <tr className="bg-background-light text-left overflow-y-auto grid grid-cols-[200px_312px] uppercase font-bold">
                    <th className="py-2 px-4 text-center">
                      Symbol
                    </th>
                    <th className="py-2 px-4 font-semibold text-center text-nowrap">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {balances.map((balance: any, index: string) => (
                    <tr
                      key={"history-" + index}
                      className={cn(
                        "bg-background overflow-y-auto grid grid-cols-[200px_312px] items-center transition-all overflow-visible",
                      )}>
                      <td className="py-2 px-4 text-center">
                        {balance.asset}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {balance.free}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-[#10102D] px-4 py-3 flex justify-end">
                <button
                  className="inline-flex justify-center rounded-sm px-4 py-2 bg-[#1A1A37] text-sm uppercase font-medium text-white"
                  onClick={() => setShowModal(false)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-y-auto max-h-[600px] rounded-md theme-border">
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="bg-background-light text-left overflow-y-auto grid grid-cols-[200px_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] uppercase font-bold">
              <th className="py-2 px-4 font-semibold text-center text-nowrap">
                Date
              </th>
              <th className="py-2 px-4 text-center">
                Pair
              </th>
              <th className="py-2 px-4 font-semibold text-center text-nowrap">
                AmountIn
              </th>
              <th className="py-2 px-4 font-semibold text-center text-nowrap">
                AmountOut
              </th>
              <th className="py-2 px-4 font-semibold text-center text-nowrap">
                Timespan
              </th>
              <th className="py-2 px-4 font-semibold text-center text-nowrap">
                ROI
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade: any, index: string) => (
              <tr
                key={"history-" + index}
                className={cn(
                  "bg-background overflow-y-auto grid grid-cols-[200px_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center transition-all overflow-visible",
                )}>
                <td className="py-2 px-4 text-center">
                  {trade.date}
                </td>
                <td className="py-2 px-4 text-center">
                  {trade.symbol}
                </td>
                <td className={`py-2 px-4 text-green text-center `} >
                  {trade.input}
                </td>
                <td className="py-2 px-4 text-center">
                  {trade.output + trade.quoteQty * (prices.filter((p: any) => p.symbol == trade.symbol)[0]?.price ?? 1)}
                </td>
                <td className="py-2 px-4 text-center">
                  {trade.timeSpan}m
                </td>
                <td className="py-2 px-4 text-center">
                  {((trade.output + trade.quoteQty * (prices.filter((p: any) => p.symbol == trade.symbol)[0]?.price ?? 1) - trade.input) / trade.input * 100).toFixed(2)} %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
