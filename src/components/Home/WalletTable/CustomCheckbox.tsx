import { cn } from "@/lib/utils";
import { FaCheck } from "react-icons/fa";

export default function CustomCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      className={cn(
        "w-5 h-5 flex items-center justify-center cursor-pointer",
        checked ? "bg-foreground" : "bg-white/10"
      )}
      onClick={onChange}>
      {checked && <FaCheck className="text-background-dark text-xs" />}
    </div>
  );
}
