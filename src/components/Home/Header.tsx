import { useAuth } from "@/contexts/AuthContext";
import { useBotContext } from "@/contexts/BotContext";
import { useRouter } from "next/navigation";
import { IoMdRefresh } from "react-icons/io";

export default function Header() {
  const { logout } = useAuth();
  const router = useRouter();
  const {
    status,
    loading,
    fetchTrades,
    fetchStatus,
    fetchPrices
  } = useBotContext();
  return (
    <div className="flex justify-between items-center rounded-t-md pb-4">
      <h1 className="text-lg font-semibold text-white uppercase">
        Crypto <span className="text-foreground">Trading</span> Bot
      </h1>
      {/* <button className="text-white bg-emerald-500 p-2 rounded-md">
        <FaSave />
      </button> */}
      <div className="flex items-center rounded-t-md">
        <button
          onClick={() => { fetchTrades(); fetchStatus(); fetchPrices(); }}
          className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase mr-2"
          disabled={loading}
        >
          <IoMdRefresh className="text-foreground text-lg" />
          Refresh
        </button>
        <button
          className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase mr-2"
          onClick={() => { router.push("/"); }}>
          Dashboard
        </button>
        <button
          className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase mr-2"
          onClick={() => { router.push("/history"); }}>
          History
        </button>
        <button
          className="bg-background-light text-white px-4 py-2 text-sm rounded-md font-semibold flex gap-1 items-center uppercase"
          onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
