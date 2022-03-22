// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx smart-contract run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

task("upgrade:EtherBet", "Deploy Merkle Airdrop Smart Contract")
  .addParam("contractaddr", "The deployed smart contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const ChainlinkEtherBet = await hre.ethers.getContractFactory(
      "ChainlinkEtherBet"
    );
    const newEtherBetting = await hre.upgrades.upgradeProxy(
      taskArguments.contractaddr,
      ChainlinkEtherBet
    );

    console.log("ChainlinkEtherBet upgraded : ", newEtherBetting.address);
  });
