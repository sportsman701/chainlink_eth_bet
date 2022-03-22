import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  BETTING_END_BEFORE_TIMESTAMP,
  BETTING_END_TIMESTAMP,
  EtherBet,
  TP_ETH_PRICE,
  ZERO_ADDRESS,
} from "../helper";

export function constructorTest(): void {
  describe("1) Constructor", async () => {
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;
    let better1: EtherBet;
    let better2: EtherBet;
    let better3: EtherBet;
    let better4: EtherBet;
    let better5: EtherBet;

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
      better3 = {
        addr: addr3.address,
        fundAmt: BigNumber.from(0),
        flag: false,
      };
      better4 = {
        addr: ZERO_ADDRESS,
        fundAmt: BigNumber.from(30),
        flag: true,
      };
      better5 = {
        addr: addr3.address,
        fundAmt: BigNumber.from(40),
        flag: true,
      };
    });

    it("- Should be set the fund ETH amount of two betters, the side that each selected and the TP ETH price of Betting, the end timestamp of betting", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );
      const etherBetting = await upgrades.deployProxy(
        ChainlinkEtherBet,
        [[better1, better2], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
        { initializer: "initialize" }
      );
      await etherBetting.deployed();

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
    });

    it("- Only two betters can be set", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );

      // No betters
      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: MUST_BE_TWO_BETTERS");

      // one better
      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[better1], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: MUST_BE_TWO_BETTERS");

      // three better
      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[better1, better2, better3], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: MUST_BE_TWO_BETTERS");
    });

    it("- Can not be set the better having zero address", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );

      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[better2, better4], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: ZERO_ADDRESS");
    });

    it("- Can not be set two betters having same address", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );

      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[better2, better2], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: SAME_ADDRESS");
    });

    it("- Can not be set the better having zero betting amount", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );

      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[better2, better3], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: ZERO_BET_AMOUNT");
    });

    it("- Can not be set two betters having same side", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );

      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[better2, better5], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: INVALID_FLAG");
    });

    it("- Can not be set the end timestamp of betting as the before of now", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );

      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[better1, better2], BETTING_END_BEFORE_TIMESTAMP, TP_ETH_PRICE],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: INVALID_TIMESTAMP");
    });

    it("- Can not be set the tp ETH price of betting as zero", async function () {
      const ChainlinkEtherBet = await ethers.getContractFactory(
        "ChainlinkEtherBet",
        owner
      );

      await expect(
        upgrades.deployProxy(
          ChainlinkEtherBet,
          [[better1, better2], BETTING_END_TIMESTAMP, 0],
          { initializer: "initialize" }
        )
      ).to.revertedWith("ChainlinkEtherBet: INVALID_PT_ETH");
    });
  });
}
