"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ActionButtons from "@/components/Home/ActionButtons";
import Header from "@/components/Home/Header";
import InputForm from "@/components/Home/InputForm";
import WalletTable from "@/components/Home/WalletTable";

import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useBotContext } from "@/contexts/BotContext";


export default function History() {
  const router = useRouter();
  const { userData } = useAuth();
  useEffect(() => {
    if (!userData) return router.push("/login");
    setLoading(false);
  }, [userData]);
  const [isLoading, setLoading] = useState(false);

  const [exchange, setExchange] = useState('mexc');
  const { loading, history } = useBotContext();

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="flex py-2 justify-center items-center min-h-screen bg-background-dark text-white/65">
      <div className="w-[98%] flex flex-col p-4 rounded-md bg-background theme-border">
        <Header />
        <div className="grid grid-rows-4 lg:grid-rows-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold uppercase">Exchange</label>
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="w-full p-2 mt-1 bg-background text-sm theme-border rounded-md outline-none"
            >
              <option value="mexc">MEXC</option>
              {/* <option value="bybit">Bybit</option> */}
            </select>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[600px] rounded-md theme-border">
          <table className="w-full text-sm min-w-[960px]">
            <thead>
              <tr className="bg-background-light text-left overflow-y-auto grid grid-cols-[75px_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr] uppercase font-bold">
                <th className="py-2 px-4 flex items-center">
                  Pir
                </th>
                <th className="py-2 px-4 font-semibold text-center text-nowrap">
                  Date
                </th>
                <th className="py-2 px-4 font-semibold text-nowrap">Side</th>
                <th className="py-2 px-4 font-semibold text-nowrap">
                  Price
                </th>
                <th className="py-2 px-4 font-semibold text-center text-nowrap">
                  Amount
                </th>
                <th className="py-2 px-4 font-semibold text-center text-nowrap">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
