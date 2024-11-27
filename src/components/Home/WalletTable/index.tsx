import TableContent from "./TableContent";
import CustomCheckbox from "./CustomCheckbox";
import { useWalletContext } from "@/contexts/WalletContext";
import { Dispatch, SetStateAction } from "react";

export default function WalletTable({ 
  tokenMint,
  selectedWallets,
  setSelectedWallets,
  setTotalBalance,
  balances,
  setBalances,
  solAmounts,
  tokenAmounts,
  setSolAmounts,
  setTokenAmounts
} : {
  tokenMint: string;
  selectedWallets: Set<string>;
  setTotalBalance: Dispatch<SetStateAction<{sol:number, token:number}>>;
  setSelectedWallets: Dispatch<SetStateAction<Set<string>>>;
  balances: Record<string, { sol: number; tokens: Record<string, number> }>;
  setBalances: Dispatch<SetStateAction<Record<string, { sol: number; tokens: Record<string, number> }>>>;
  solAmounts: Record<string, number>;
  tokenAmounts: Record<string, number>;
  setSolAmounts: Dispatch<SetStateAction<Record<string, number>>>;
  setTokenAmounts: Dispatch<SetStateAction<Record<string, number>>>;
}) {

  const { wallets } = useWalletContext()

  const handleSelectAll = () => {
    if (selectedWallets.size === wallets.length) {
      setSelectedWallets(new Set());
      setTotalBalance({sol:0, token:0})
    } else {
      const result = wallets.reduce(
        (accumulator: any, wallet:any) => {
          accumulator.publicKeys.push(wallet.publicKey);
          accumulator.totalBalance.sol += balances[wallet.publicKey]?.sol;
          const tokenBalance = balances[wallet.publicKey].tokens[tokenMint] ? balances[wallet.publicKey].tokens[tokenMint] : 0
          accumulator.totalBalance.token += tokenBalance;
          return accumulator;
        },
        { publicKeys: [], totalBalance: {sol: 0, token: 0} }
      );
      setTotalBalance({sol:result.totalBalance.sol, token:result.totalBalance.token})
      setSelectedWallets(new Set(result.publicKeys));
    }
  };

  return (
    <div className="overflow-y-auto max-h-[600px] rounded-md theme-border">
      <table className="w-full text-sm min-w-[960px]">
        <thead>
          <tr className="bg-background-light text-left overflow-y-auto grid grid-cols-[75px_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr] uppercase font-bold">
            <th className="py-2 px-4 flex items-center">
              <CustomCheckbox
                checked={selectedWallets.size === wallets.length}
                onChange={handleSelectAll}
              />
              <span className="ml-2 text-base">#</span>
            </th>
            <th className="py-2 px-4 font-semibold text-center text-nowrap">
              Address
            </th>
            {/* <th className="py-2 px-4 font-semibold text-center text-nowrap">
              Secrete Key
            </th> */}
            <th className="py-2 px-4 font-semibold text-nowrap">SOL Balance</th>
            <th className="py-2 px-4 font-semibold text-nowrap">
              Token Balance
            </th>
            <th className="py-2 px-4 font-semibold text-center text-nowrap">
              Sol Amount
            </th>
            <th className="py-2 px-4 font-semibold text-center text-nowrap">
              Token Amount
            </th>
          </tr>
        </thead>
        <TableContent
          tokenMint={tokenMint}
          selectedWallets={selectedWallets}
          setSelectedWallets={setSelectedWallets}
          setTotalBalance={setTotalBalance}
          wallets={wallets}
          balances={balances}
          setBalances={setBalances}
          solAmounts={solAmounts}
          tokenAmounts={tokenAmounts}
          setSolAmounts={setSolAmounts}
          setTokenAmounts={setTokenAmounts}
        />
      </table>
    </div>
  );
}
