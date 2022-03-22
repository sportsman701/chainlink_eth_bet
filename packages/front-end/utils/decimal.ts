const { ethers } = require("ethers");
import {BigNumber} from "@ethersproject/bignumber";

export function parseWithDecimals(amount: number) {
    return ethers.utils.parseUnits(Math.floor(amount).toString(), 18);
}

export function formatWithDecimals(amount: BigNumber) {
    return ethers.utils.formatUnits(amount, 18);
}
