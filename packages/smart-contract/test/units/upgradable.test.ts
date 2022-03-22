import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AFTER_ONE_HOUR_TIESTAMP, EtherBet, TP_ETH_PRICE } from "../helper";

export function upgradableTest(): void {
  describe("3) Upgradable", async () => {
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;
    let better1: EtherBet;
    let better2: EtherBet;
    let etherBetting: Contract;
    let ChainlinkEtherBetV2: ContractFactory;

    before(async () => {
      [owner, addr1, addr2, addr3] = await ethers.getSigners();

      // Initialize Betters Data
      better1 = {
        addr: addr1.address,
        fundAmt: BigNumber.from(10),
        flag: false,
      };
      better2 = {
        addr: addr2.address,
        fundAmt: BigNumber.from(20),
        flag: true,
      };
    });

    beforeEach("deploy contract", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );
      etherBetting = await upgrades.deployProxy(
        ChainlinkEtherBet,
        [[better1, better2], AFTER_ONE_HOUR_TIESTAMP, TP_ETH_PRICE],
        { initializer: "initialize" }
      );
      await etherBetting.deployed();

      ChainlinkEtherBetV2 = await ethers.getContractFactory(
        "ChainlinkEtherBetV2",
        owner
      );
    });

    it("- After upgrading, the new functions and old functions should be called with same address", async function () {
      const etherBettingV2 = await upgrades.upgradeProxy(
        etherBetting.address,
        ChainlinkEtherBetV2
      );
      // Check address
      expect(etherBettingV2.address).to.eq(etherBetting.address);
      // Call new function
      await etherBettingV2.setPriceFeed(addr3.address);
      // Call old function
      const addr1Index = await etherBetting.getBetterIndex(better1.addr);
      await etherBettingV2.betters(addr1Index);
    });

    it("- After upgrading, the betters` data should be kept", async function () {
      const etherBettingV2 = await upgrades.upgradeProxy(
        etherBetting.address,
        ChainlinkEtherBetV2
      );

      const addr1Index = await etherBetting.getBetterIndex(better1.addr);
      const {
        0: addr1,
        1: fundAmt1,
        2: flag1,
      } = await etherBetting.betters(addr1Index);

      expect(addr1).to.eq(better1.addr);
      expect(fundAmt1).to.eq(better1.fundAmt);
      expect(flag1).to.eq(better1.flag);

      const addr2Index = await etherBetting.getBetterIndex(better2.addr);
      const {
        0: addr2,
        1: fundAmt2,
        2: flag2,
      } = await etherBetting.betters(addr2Index);

      expect(addr2).to.eq(better2.addr);
      expect(fundAmt2).to.eq(better2.fundAmt);
      expect(flag2).to.eq(better2.flag);

      expect(await etherBettingV2.endTp()).to.eq(AFTER_ONE_HOUR_TIESTAMP);
      expect(await etherBettingV2.tpPrice()).to.eq(TP_ETH_PRICE);
    });
  });
}
