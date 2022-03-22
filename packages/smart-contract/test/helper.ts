import { BigNumber } from "ethers";
import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";

function getTimestamp(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

export async function travelTime(ethers: HardhatEthersHelpers, time: number) {
  await ethers.provider.send("evm_increaseTime", [time]);
  await ethers.provider.send("evm_mine", []);
}

export const ONE_HOUR = 3600;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const BETTING_END_BEFORE_TIMESTAMP = getTimestamp(new Date(2021, 1, 1));
export const BETTING_END_TIMESTAMP = getTimestamp(new Date(2022, 5, 1));
export const AFTER_ONE_HOUR_TIESTAMP = getTimestamp(new Date()) + 3600;
export const TP_ETH_PRICE = BigNumber.from(3000);

export type EtherBet = {
  addr: string;
  fundAmt: BigNumber;
  flag: Boolean;
};
