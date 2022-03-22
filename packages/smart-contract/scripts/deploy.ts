// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx smart-contract run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {
  BETTER_1,
  BETTER_2,
  BETTING_END_TIMESTAMP,
  TP_ETH_PRICE,
} from "./params";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { publish } from "./publish";

task("deploy:EtherBet", "Deploy ChainlinkEtherBet Smart Contract").setAction(
  async function (taskArguments: TaskArguments, hre) {
    const ChainlinkEtherBet = await hre.ethers.getContractFactory(
      "ChainlinkEtherBet"
    );

    // Deploy Contract
    const etherBetting = await hre.upgrades.deployProxy(
      ChainlinkEtherBet,
      [[BETTER_1, BETTER_2], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
      { initializer: "initialize" }
    );
    await etherBetting.deployed();

    console.log("ChainlinkEtherBet deployed to:", etherBetting.address);

    await publish(etherBetting.address);
  }
);
