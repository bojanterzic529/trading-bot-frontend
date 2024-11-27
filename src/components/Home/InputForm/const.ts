import { SiSolana } from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import { IoIosDownload } from "react-icons/io";
import { AiFillPlusCircle } from "react-icons/ai";

const ActionButtons = [
  { text: "Generate Wallets", Icon: AiFillPlusCircle },
  { text: "Import Wallet", Icon: AiFillPlusCircle },
  { text: "Download Wallets", Icon: IoIosDownload },
  { text: "Set Token Amount", Icon: FaDatabase },
  { text: "Set SOL Amount", Icon: SiSolana },
];

const InputFields = [
  { label: "Token Address", placeholder: "Enter Address" },
  { label: "Admin Wallet", placeholder: "Enter Private Key" },
  { label: "Jito Tip Amount", placeholder: "Enter jito tip amount" },
];

export { ActionButtons, InputFields };
