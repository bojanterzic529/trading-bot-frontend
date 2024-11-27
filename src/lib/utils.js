import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import * as crypto from 'crypto';
import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from "dotenv"
import bs58 from 'bs58'
dotenv.config()
// const crypto = require('crypto');

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const decrypt = (hash) => {
  
  const encrypt_key = '9e6874cf42e3d7b70c2298eeb58328386983a1d035cfe5cada637d3c309c1247';
  const algorithm = 'aes-256-ctr';
  const secretKey = Buffer.from(encrypt_key, 'hex');

  const [ivHex, encryptedData] = hash.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedData, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
  ]);

  const privateKeyBase58 = decrypted.toString('utf8');
  // const privateKeyUint8Array = bs58.decode(privateKeyBase58);
  // console.log('log->privateKeyUint8Array', privateKeyUint8Array)
  return privateKeyBase58;
};

export const shortenAddress = (address) => {
  
}