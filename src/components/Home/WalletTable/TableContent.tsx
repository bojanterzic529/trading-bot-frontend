import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { SiSolana } from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import CustomCheckbox from "./CustomCheckbox";
import { cn, decrypt } from "@/lib/utils";
import { PublicKey, Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import Slider from "../Slider";

export interface Wallet {
  publicKey: string;
}

export const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=09693b1a-ab6a-46ac-a104-9eedc4573c0b')

export default function TableContent({
  tokenMint,
  selectedWallets,
  setSelectedWallets,
  setTotalBalance,
  wallets,
  balances,
  setBalances,
  solAmounts,
  tokenAmounts,
  setSolAmounts,
  setTokenAmounts
}: {
  tokenMint: string;
  selectedWallets: Set<string>;
  setTotalBalance: Dispatch<SetStateAction<{ sol: number, token: number }>>;
  setSelectedWallets: Dispatch<SetStateAction<Set<string>>>;
  wallets: Array<Wallet>;
  balances: Record<string, { sol: number; tokens: Record<string, number> }>;
  setBalances: Dispatch<SetStateAction<Record<string, { sol: number; tokens: Record<string, number> }>>>;
  solAmounts: Record<string, number>;
  tokenAmounts: Record<string, number>;
  setSolAmounts: Dispatch<SetStateAction<Record<string, number>>>;
  setTokenAmounts: Dispatch<SetStateAction<Record<string, number>>>;
}) {

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const balancesPromises = wallets.map(async (wallet) => {
          const publicKey = new PublicKey(wallet.publicKey);

          // Fetch SOL balance
          const solBalance = await connection.getBalance(publicKey);

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

        const balancesArray = await Promise.all(balancesPromises);
        console.log('log-> table balances:', balancesArray)
        const newBalances = balancesArray.reduce(
          (acc, { publicKey, sol, tokens }) => ({ ...acc, [publicKey]: { sol, tokens } }),
          {}
        );
        setBalances(newBalances);
      } catch (error) {
        console.error('Failed to fetch balances:', error);
      }
    };

    fetchBalances();
  }, [wallets]);

  const toggleRowSelection = (publicKey: string) => {
    setSelectedWallets(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(publicKey)) {
        newSelected.delete(publicKey);
      } else {
        newSelected.add(publicKey);
      }

      const newTotalBalances = Array.from(newSelected).reduce(
        (sum, publicKey) => {
          sum.sol += balances[publicKey].sol ? balances[publicKey].sol : 0;
          sum.token += balances[publicKey].tokens[tokenMint] ? balances[publicKey].tokens[tokenMint] : 0;
          return sum;
        },
        { sol: 0, token: 0 }
      );

      setTotalBalance(newTotalBalances);
      return newSelected;
    });
  };

  const handleSolAmountChange = (publicKey: string, amount: number) => {
    setSolAmounts(prevAmounts => ({
      ...prevAmounts,
      [publicKey]: amount,
    }));
  };

  const handleTokenAmountChange = (publicKey: string, amount: number) => {
    setTokenAmounts(prevAmounts => ({
      ...prevAmounts,
      [publicKey]: amount,
    }));
  };

  return (
    <>
      {wallets.length > 0 ?
        <tbody>
          {wallets.map((wallet: any, index: any) => {
            const isSelected = selectedWallets.has(wallet.publicKey);
            // const balance
            return (
              <tr
                key={wallet._id}
                className={cn(
                  "bg-background overflow-y-auto grid grid-cols-[75px_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center transition-all overflow-visible",
                  isSelected ? "bg-background-dark" : "bg-background"
                )}>
                <td className="py-2 px-4 flex items-center">
                  <CustomCheckbox
                    // checked={selectedRows[index]}
                    checked={selectedWallets.has(wallet.publicKey)}
                    onChange={() => toggleRowSelection(wallet.publicKey)}
                  />
                  <span className="ml-2">{index + 1}</span>
                </td>

                <td className="py-2 px-4 text-center">
                  {wallet.publicKey}
                </td>

                {/* <td className="py-2 px-4 text-start">
                {decrypt(wallet.encryptedPrivateKey)}
              </td> */}

                <td className="py-2 px-4 flex gap-1 items-center">
                  <SiSolana className="text-gray-600" />
                  <span className="text-yellow-600">{balances[wallet.publicKey]?.sol ?? 'Loading...'}</span>
                </td>

                <td className="py-2 px-4 flex gap-1 items-center">
                  <FaDatabase className="text-gray-600" />
                  <span className="text-white">
                    {balances[wallet.publicKey]?.tokens[tokenMint] && tokenMint
                      ? balances[wallet.publicKey]?.tokens[tokenMint]
                      // ? Object.entries(balances[wallet.publicKey].tokens).map(
                      //     ([mint, amount]) => (
                      //       <div key={mint}>
                      //         {mint}: {amount}
                      //       </div>
                      //     )
                      //   )
                      : '0'}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <Slider
                    key={wallet.publicKey}
                    value={solAmounts[wallet.publicKey] || ''}
                    max={balances[wallet.publicKey]?.sol}
                    setValue={(v: number) => { handleSolAmountChange(wallet.publicKey, v) }}
                  />
                </td>
                <td className="py-2 px-4">
                  <Slider
                    key={wallet.publicKey}
                    value={tokenAmounts[wallet.publicKey] || ''}
                    max={balances[wallet.publicKey]?.tokens[tokenMint] ?? 0}
                    setValue={(v: number) => { handleTokenAmountChange(wallet.publicKey, v) }}
                    enableMax={true}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        :
        <tbody>
          <tr>
            <td>No Wallets to show</td>
          </tr>
        </tbody>
      }
    </>
  );
}
