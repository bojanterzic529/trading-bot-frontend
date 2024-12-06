"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Home/Header";

import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useBotContext } from "@/contexts/BotContext";
import { cn } from "@/lib/utils";
import { IoMdRefresh } from "react-icons/io";


export default function History() {
  const router = useRouter();
  const { userData, loading: isLoading } = useAuth();
  useEffect(() => {
    if (!userData && !isLoading) return router.push("/login");
  }, [userData, isLoading]);
  // const [isLoading, setLoading] = useState(false);

  const [exchange, setExchange] = useState('mexc');
  const {
    status,
    history,
    loading,
    fetchTrades,
    fetchStatus,
    fetchPrices
  } = useBotContext();

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="flex py-2 justify-center items-center min-h-screen bg-background-dark text-white/65">
      <div className="w-[98%] flex flex-col p-4 rounded-md bg-background theme-border">
        <Header />
        <div className="overflow-y-auto max-h-[600px] rounded-md theme-border">
          <table className="w-full text-sm min-w-[960px]">
            <thead>
              <tr className="bg-background-light text-left overflow-y-auto grid grid-cols-[75px_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr] uppercase font-bold">
                <th className="py-2 px-4 flex items-center">
                  Pair
                </th>
                <th className="py-2 px-4 font-semibold text-center text-nowrap">
                  Date
                </th>
                <th className="py-2 px-4 font-semibold text-center text-nowrap">Side</th>
                <th className="py-2 px-4 font-semibold text-center text-nowrap">
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
              {history.flat().map((trade: any, index: string) => (
                <tr
                  key={"history-" + index}
                  className={cn(
                    "bg-background overflow-y-auto grid grid-cols-[75px_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center transition-all overflow-visible",
                  )}>
                  <td className="py-2 px-4 text-center">
                    {trade.symbol}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {new Date(1 * trade.time + new Date().getTimezoneOffset()).toString()}
                  </td>
                  <td className={`py-2 px-4 text-green text-center ${trade.isBuyer ? "text-foreground" : "text-red-500"}`} >
                    {trade.isBuyer ? "Buy" : "Sell"}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {trade.price}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {trade.qty} {trade.symbol.replaceAll(trade.commissionAsset, '')}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {trade.quoteQty} {trade.commissionAsset}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
