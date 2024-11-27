import { AiOutlineLoading } from "react-icons/ai";
export default function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-background">
      <AiOutlineLoading className="text-5xl animate-spin text-white" />
    </div>
  );
}
