import { useState, Dispatch, SetStateAction, useRef } from "react";
import axios from 'axios';
import { spiltSol, gatherSol, createAndBuy, sell, gatherTokens, useWalletContext } from "@/contexts/WalletContext";
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { connection } from "./WalletTable/TableContent";
import dotenv from "dotenv"
import validator from '../../lib/validator';
import { toast } from "react-toastify";

dotenv.config()
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

const MAX_IMG_SIZE = 1 * 1024 * 1024; // 1MB image file size limit

export default function ActionButtons({
  tokenMint,
  selectedWallets,
  solAmounts,
  tokenAmounts,
  adminWallet,
  jitoTipAmount,
  setBalances
}: {
  tokenMint: string;
  selectedWallets: Set<string>;
  solAmounts: Record<string, number>;
  tokenAmounts: Record<string, number>;
  adminWallet: string;
  jitoTipAmount: string;
  setBalances: Dispatch<SetStateAction<Record<string, { sol: number; tokens: Record<string, number> }>>>;
}) {
  const { wallets } = useWalletContext()
  const [targetWallet, setTargetWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef(null);

  const fetchBundleStatus = async (bundleId: string) => {
    const res = await axios.post('https://mainnet.block-engine.jito.wtf/api/v1/bundles', {
      jsonrpc: "2.0",
      id: 1,
      method: "getBundleStatuses",
      params: [
        [bundleId]
      ],
    });
    console.log('log->getBundle Response', res.data.result.value)
    if (res.data.result.value[0]?.confirmation_status === 'confirmed') {
      toast.success('Success!');
      return true;
    } else {
      return false;
    }
  }

  // create & buy token params
  const [tokenData, setTokenData] = useState({
    name: '',
    ticker: '',
    desc: '',
    image: null,
    twitter: '',
    telegram: '',
    website: ''
  });

  const handleTokenFormChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      const selectedFile = files[0];
      if (selectedFile.size > MAX_IMG_SIZE) {
        toast.error('Image file size exceeds the 1MB limit');
        if (fileRef.current) {
          // @ts-ignore
          fileRef.current.value = '';
        }
        setTokenData((prevData) => ({
          ...prevData,
          [name]: null,
        }));
      } else {
        setTokenData((prevData) => ({
          ...prevData,
          [name]: selectedFile,
        }));
      }
    } else {
      setTokenData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const fetchBalances = async () => {
    try {
      const balancesPromises = wallets.map(async (wallet: any) => {
        const publicKey = new PublicKey(wallet.publicKey);

        // Fetch SOL balance
        const solBalance = await connection.getBalance(publicKey, 'confirmed');

        // Fetch SPL token balances
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        const tokenBalances: Record<string, number> = {};
        tokenAccounts.value.forEach(({ account }) => {
          const tokenAmount = account.data.parsed.info.tokenAmount;
          const mintAddress = account.data.parsed.info.mint;
          tokenBalances[mintAddress] = tokenAmount.uiAmount;
        });

        return {
          publicKey: wallet.publicKey,
          sol: solBalance / 1e9, // Convert lamports to SOL
          tokens: tokenBalances,
        };
      });

      await (new Promise((resolve) => {
        setTimeout(resolve, 10000);
      }));

      const balancesArray = await Promise.all(balancesPromises);
      console.log('log->balances:', balancesArray)
      const newBalances = balancesArray.reduce(
        (acc, { publicKey, sol, tokens }) => ({ ...acc, [publicKey]: { sol, tokens } }),
        {}
      );
      console.log('log->newBalances', newBalances)
      setBalances(newBalances);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  };

  const handleSpiltSol = async () => {
    const [result] = validator([
      {
        value: adminWallet,
        validatorMethod: (v: any) => !!v,
        message: "Please enter admin wallet!"
      },
      {
        value: selectedWallets,
        validatorMethod: (v: any) => Array.from(v).length > 0,
        message: "Please select wallets!"
      },
      {
        value: solAmounts,
        validatorMethod: (v: any) => {
          let walletArray = Array.from(selectedWallets);
          return walletArray.map((wallet) => solAmounts[wallet as string]).filter(sol => sol > 0).length === walletArray.length
        },
        message: "Please enter valid SOL amounts!"
      },
    ]);
    if (!result) return;
    let toast_id = toast.loading('processing...');
    try {
      setLoading(true);
      const res = await axios.post(`${backendURL}/api/spilt-sol`, {
        selectedWallets: [...selectedWallets],
        solAmounts,
        adminPk: adminWallet,
        tipAmount: jitoTipAmount
      });
      console.log('log->spiltSol res', res)
      if (res.data.success) {
        await fetchBalances(); // Refresh wallet list
        toast.success('SOL splitted successfully!');
      } else if (res.data.result[1]) {
        let retryCount = 1;
        let retry_id = toast.loading('retrying...' + ' ' + retryCount)
        const timerId = setInterval(async () => {
          retryCount++;
          toast.dismiss(retry_id)
          retry_id = toast.loading('retrying...' + ' ' + retryCount)
          const result = await fetchBundleStatus(res.data.result[1])
          if (retryCount > 10 || result) {
            clearInterval(timerId);
            toast.error('Failed');
            await fetchBalances();
          }
        }, 2000);
      } else {
        console.error('Failed to spilt sol:', res.data.error);
        toast.error('Failed to split SOL');
      }
    } catch (error) {
      console.error('Error spilting sols:', error);
      toast.error('Failed to split SOL');
    } finally {
      toast.dismiss(toast_id);
      setLoading(false);
    }
  }

  const handleGatherSol = async () => {
    const [result] = validator([
      {
        value: adminWallet,
        validatorMethod: (v: any) => !!v,
        message: "Please enter admin wallet!"
      },
      {
        value: targetWallet,
        validatorMethod: (v: any) => !!v,
        message: "Please enter target wallet!"
      },
      {
        value: selectedWallets,
        validatorMethod: (v: any) => Array.from(v).length > 0,
        message: "Please select wallets!"
      },
    ]);
    if (!result) return;
    let toast_id = toast.loading('processing...');
    try {
      setLoading(true);
      const res = await axios.post(`${backendURL}/api/collect-sol`, {
        selectedWallets: [...selectedWallets],
        targetWallet,
        adminPk: adminWallet,
        tipAmount: jitoTipAmount
      });
      console.log('log->gatherSol res', res)
      if (res.data.success) {
        toast.success('SOL collected successfully!');
      } else if (res.data.result[1]) {
        let retryCount = 1;
        let retry_id = toast.loading('retrying...' + ' ' + retryCount)
        const timerId = setInterval(async () => {
          retryCount++;
          toast.dismiss(retry_id)
          retry_id = toast.loading('retrying...' + ' ' + retryCount)
          const result = await fetchBundleStatus(res.data.result[1])
          if (retryCount > 10 || result) {
            clearInterval(timerId);
            toast.error('Failed');
            await fetchBalances();
          }
        }, 2000);
      } else {
        console.error('Failed to collect sol:', res.data.error);
        toast.error('Failed to collect SOL');
      }
    } catch (error) {
      console.error('Error collecting sol:', error);
      toast.error('Failed to collect SOL');
    } finally {
      await fetchBalances(); // Refresh wallet list
      toast.dismiss(toast_id);
      setLoading(false);
    }
  }

  const showCreateBuyModal = () => {
    const [result] = validator([
      {
        value: adminWallet,
        validatorMethod: (v: any) => !!v,
        message: "Please enter admin wallet!"
      },
      {
        value: selectedWallets,
        validatorMethod: (v: any) => Array.from(v).length > 0,
        message: "Please select wallets!"
      },
      {
        value: solAmounts,
        validatorMethod: (v: any) => {
          let walletArray = Array.from(selectedWallets);
          return walletArray.map((wallet) => solAmounts[wallet as string]).filter(sol => sol > 0).length === walletArray.length
        },
        message: "Please enter valid SOL amounts!"
      },
    ]);
    if (!result) return;
    setShowModal(true);
  }

  const handleCreateAndBuy = async (e: any) => {
    e.preventDefault();
    let toast_id = toast.loading('processing...');
    try {
      setLoading(true);
      const res = await axios.post(`${backendURL}/api/create-buy`, {
        ...tokenData,
        adminPk: adminWallet,
        tipAmount: jitoTipAmount,
        selectedWallets: [...selectedWallets],
        solAmounts
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('log->createAndBuy res', res)
      if (res.data.success) {
        const tokenAddress = res.data.mintAddress;
        toast.success(
          <div>
            Created Token&nbsp;
            <a
              href={`https://solscan.io/token/${tokenAddress}`}
              target="_blank"
              style={{
                textDecoration: 'underline',
                color: 'dodgerblue'
              }}
            >
              {tokenAddress}
            </a>
          </div>, {
          autoClose: false
        });
      } else {
        console.error('Failed to create and buy:', res.data.error);
        toast.error('Failed to create and buy');
      }
    } catch (error) {
      console.error('Error creating and buying:', error);
      toast.error('Failed to create and buy');
    } finally {
      await fetchBalances(); // Refresh wallet list
      toast.dismiss(toast_id);
      setLoading(false);
    }

    setTokenData({
      name: '',
      ticker: '',
      desc: '',
      image: null,
      twitter: '',
      telegram: '',
      website: ''
    })

    setShowModal(false);
  }

  const handleSell = async (isPump: boolean) => {
    const [result] = validator([
      {
        value: adminWallet,
        validatorMethod: (v: any) => !!v,
        message: "Please enter admin wallet!"
      },
      {
        value: tokenMint,
        validatorMethod: (v: any) => !!v,
        message: "Please enter token address!"
      },
      {
        value: selectedWallets,
        validatorMethod: (v: any) => Array.from(v).length > 0,
        message: "Please select wallets!"
      },
    ]);
    if (!result) return;
    let toast_id = toast.loading('processing...');
    try {
      setLoading(true);
      const res = await axios.post(`${backendURL}/api/sell`, {
        selectedWallets: [...selectedWallets],
        tokenMint,
        adminPk: adminWallet,
        tipAmount: jitoTipAmount,
        tokenAmounts,
        isPump
      });
      console.log('log->sell res', res)
      if (res.data.success) {
        toast.success('Sold successfully!');
      } else if (res.data.result[1]) {
        let retryCount = 1;
        let retry_id = toast.loading('retrying...' + ' ' + retryCount)
        const timerId = setInterval(async () => {
          retryCount++;
          toast.dismiss(retry_id)
          retry_id = toast.loading('retrying...' + ' ' + retryCount)
          const result = await fetchBundleStatus(res.data.result[1])
          if (retryCount > 10 || result) {
            clearInterval(timerId);
            toast.error('Failed');
            await fetchBalances();
          }
        }, 2000);
      } else {
        console.error('Failed to sell tokens:', res.data.error);
        toast.error('Failed to sell');
      }
    } catch (error) {
      console.error('Error selling tokens:', error);
      toast.error('Failed to sell');
    } finally {
      await fetchBalances(); // Refresh wallet list
      toast.dismiss(toast_id);
      setLoading(false);
    }
  }

  const handleBuy = async (isPump: boolean) => {
    const [result] = validator([
      {
        value: adminWallet,
        validatorMethod: (v: any) => !!v,
        message: "Please enter admin wallet!"
      },
      {
        value: tokenMint,
        validatorMethod: (v: any) => !!v,
        message: "Please enter token address!"
      },
      {
        value: selectedWallets,
        validatorMethod: (v: any) => Array.from(v).length > 0,
        message: "Please select wallets!"
      },
    ]);
    if (!result) return;
    let toast_id = toast.loading('processing...');
    try {
      setLoading(true);
      const res = await axios.post(`${backendURL}/api/buy`, {
        selectedWallets: [...selectedWallets],
        tokenMint,
        adminPk: adminWallet,
        tipAmount: jitoTipAmount,
        solAmounts,
        isPump
      });
      console.log('log->buy res', res)
      if (res.data.success) {
        toast.success('Bought successfully!');
      } else if (res.data.result[1]) {
        let retryCount = 1;
        let retry_id = toast.loading('retrying...' + ' ' + retryCount)
        const timerId = setInterval(async () => {
          retryCount++;
          toast.dismiss(retry_id)
          retry_id = toast.loading('retrying...' + ' ' + retryCount)
          const result = await fetchBundleStatus(res.data.result[1])
          if (retryCount > 10 || result) {
            clearInterval(timerId);
            toast.error('Failed');
            await fetchBalances();
          }
        }, 2000);
      } else {
        console.error('Failed to buy tokens:', res.data.error);
        toast.error('Failed to buy');
      }
    } catch (error) {
      console.error('Error buying tokens:', error);
      toast.error('Failed to buy');
    } finally {
      await fetchBalances(); // Refresh wallet list
      toast.dismiss(toast_id);
      setLoading(false);
    }
  }

  const handleGatherTokens = async () => {
    const [result] = validator([
      {
        value: adminWallet,
        validatorMethod: (v: any) => !!v,
        message: "Please enter admin wallet!"
      },
      {
        value: targetWallet,
        validatorMethod: (v: any) => !!v,
        message: "Please enter target wallet!"
      },
      {
        value: tokenMint,
        validatorMethod: (v: any) => !!v,
        message: "Please enter token address!"
      },
      {
        value: selectedWallets,
        validatorMethod: (v: any) => Array.from(v).length > 0,
        message: "Please select wallets!"
      },
    ]);
    if (!result) return;
    let toast_id = toast.loading('processing...');
    try {
      setLoading(true);
      const res = await axios.post(`${backendURL}/api/collect-token`, {
        selectedWallets: [...selectedWallets],
        tokenMint,
        targetWallet,
        adminPk: adminWallet,
        tipAmount: jitoTipAmount,
      });
      console.log('log->gatherTokens res', res)
      if (res.data.success) {
        toast.success('Token collected successfully!');
      } else if (res.data.result[1]) {
        let retryCount = 1;
        let retry_id = toast.loading('retrying...' + ' ' + retryCount)
        const timerId = setInterval(async () => {
          retryCount++;
          toast.dismiss(retry_id)
          retry_id = toast.loading('retrying...' + ' ' + retryCount)
          const result = await fetchBundleStatus(res.data.result[1])
          if (retryCount > 10 || result) {
            clearInterval(timerId);
            toast.error('Failed');
            await fetchBalances();
          }
        }, 2000);
      } else {
        console.error('Failed to collect tokens:', res.data.error);
        toast.error('Failed to collect token');
      }
    } catch (error) {
      console.error('Error collecting tokens:', error);
      toast.error('Failed to collect token');
    } finally {
      await fetchBalances(); // Refresh wallet list
      toast.dismiss(toast_id);
      setLoading(false);
    }
  }

  const actionButtons = [
    {
      text: 'spilt SOL',
      handler: handleSpiltSol
    },
    {
      text: 'buy on pump',
      handler: () => handleBuy(true)
    },
    {
      text: 'buy on raydium',
      handler: () => handleBuy(false)
    },
    {
      text: 'sell on pump',
      handler: () => handleSell(true)
    },
    {
      text: 'sell on raydium',
      handler: () => handleSell(false)
    },
    {
      text: 'collect sol',
      handler: handleGatherSol
    },
    {
      text: 'collect tokens',
      handler: handleGatherTokens
    },
  ]

  return (
    <>
      <div className="mt-4 flex justify-between items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 md:max-w-96 w-full">
          <label className="text-sm font-semibold text-nowrap uppercase">
            Target Wallet:
          </label>
          <input
            type="text"
            value={targetWallet}
            onChange={(e) => setTargetWallet(e.target.value)}
            placeholder="Target Wallet Address"
            className="w-full p-2 mt-1 bg-background text-sm border theme-border outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {
            actionButtons.map((action, index) => (
              <button
                key={index}
                disabled={loading}
                onClick={action.handler}
                className="bg-foreground text-white px-4 py-2 font-semibold text-sm rounded-sm uppercase disabled:bg-slate-500">
                {action.text}
              </button>
            ))
          }
        </div>
      </div>

      {/* create & buy modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
        >
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#10102D] rounded-lg overflow-hidden shadow-xl max-w-lg w-full"
          >
            <div className="bg-[#18E299] uppercase px-4 py-3 text-white text-lg font-semibold">
              Create & Buy
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateAndBuy}>
                <div className="mb-4">
                  <label className="block text-white">Name</label>
                  <input type="text" name="name" value={tokenData.name} onChange={handleTokenFormChange} required className="mt-1 block w-full px-3 py-2 bg-background rounded-md theme-border outline-none text-white" />
                </div>
                <div className="mb-4">
                  <label className="block text-white">Ticker</label>
                  <input type="text" name="ticker" value={tokenData.ticker} onChange={handleTokenFormChange} required className="mt-1 block w-full px-3 py-2 bg-background rounded-md theme-border outline-none text-white" />
                </div>
                <div className="mb-4">
                  <label className="block text-white">Image</label>
                  <input type="file" ref={fileRef} name="image" onChange={handleTokenFormChange} required className="mt-1 block w-full text-white" />
                </div>
                <div className="mb-4">
                  <label className="block text-white">Description</label>
                  <textarea required name="desc" value={tokenData.desc} onChange={handleTokenFormChange} className="mt-1 block w-full px-3 py-2 bg-background rounded-md theme-border outline-none text-white" />
                </div>
                <div className="mb-4">
                  <label className="block text-white">Twitter</label>
                  <input type="text" name="twitter" value={tokenData.twitter} onChange={handleTokenFormChange} placeholder="(Optional)" className="mt-1 block w-full px-3 py-2 bg-background rounded-md theme-border outline-none text-white" />
                </div>
                <div className="mb-4">
                  <label className="block text-white">Telegram</label>
                  <input type="text" name="telegram" value={tokenData.telegram} onChange={handleTokenFormChange} placeholder="(Optional)" className="mt-1 block w-full px-3 py-2 bg-background rounded-md theme-border outline-none text-white" />
                </div>
                <div className="mb-4">
                  <label className="block text-white">Website</label>
                  <input type="text" name="website" value={tokenData.website} onChange={handleTokenFormChange} placeholder="(Optional)" className="mt-1 block w-full px-3 py-2 bg-background rounded-md theme-border outline-none text-white" />
                </div>
                <div className="bg-[#10102D] px-4 py-3 flex justify-end">
                  <button
                    className="inline-flex justify-center rounded-sm px-4 py-2 bg-[#1A1A37] text-sm uppercase font-medium text-white"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center rounded-sm px-4 py-2 bg-[#18E299] text-sm uppercase font-medium text-white"
                  >
                    Create & Buy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}