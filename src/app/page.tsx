"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ActionButtons from "@/components/Home/ActionButtons";
import Header from "@/components/Home/Header";
import InputForm from "@/components/Home/InputForm";
import WalletTable from "@/components/Home/WalletTable";

import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";


export default function Home() {
  const router = useRouter();
  const { userData } = useAuth();
  useEffect(() => {
    if (!userData) return router.push("/login");
    setLoading(false);
  }, [userData]);
  const [isLoading, setLoading] = useState(false);

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="flex py-2 justify-center items-center min-h-screen bg-background-dark text-white/65">
      <div className="w-[98%] flex flex-col p-4 rounded-md bg-background theme-border">
        <Header />
        <InputForm/>
        {/* <WalletTable
          tokenMint={tokenMint}
          selectedWallets={selectedWallets}
          setSelectedWallets={setSelectedWallets}
          setTotalBalance={setTotalBalance}
          balances={balances}
          setBalances={setBalances}
          solAmounts={solAmounts}
          tokenAmounts={tokenAmounts}
          setSolAmounts={setSolAmounts}
          setTokenAmounts={setTokenAmounts}
        /> */}
        {/* <ActionButtons
          tokenMint={tokenMint}
          selectedWallets={selectedWallets}
          solAmounts={solAmounts}
          tokenAmounts={tokenAmounts}
          adminWallet={adminWallet}
          jitoTipAmount={jitoTipAmount}
          setBalances={setBalances}
        /> */}
      </div>
    </div>
  );
}
