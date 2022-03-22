import { ethers } from "ethers";

function getTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

function parseWithDecimals(amount: string) {
  return ethers.utils.parseUnits(amount, 18);
}

export const BETTER_1 = {
  addr: "0x54cfF4e34155d2A1D74c2968ca62F557a1C2B709",
  fundAmt: parseWithDecimals("0.05"),
  flag: false,
};
export const BETTER_2 = {
  addr: "0x76e7BC85008156cFc477d5cc0a6c69616BaD269e",
  fundAmt: parseWithDecimals("0.05"),
  flag: true,
};

// Target Date: 2022:06:01
export const BETTING_END_TIMESTAMP = getTimestamp(new Date(2022, 5, 1));
// Target Price: $4000
export const TP_ETH_PRICE = parseWithDecimals("4000");
