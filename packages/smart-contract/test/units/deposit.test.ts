import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BETTING_END_TIMESTAMP, EtherBet, TP_ETH_PRICE } from "../helper";

export function depositTest(): void {
  describe("2) Deposit", async () => {
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;
    let better1: EtherBet;
    let better2: EtherBet;
    let etherBetting: Contract;

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
        [[better1, better2], BETTING_END_TIMESTAMP, TP_ETH_PRICE],
        { initializer: "initialize" }
      );
      await etherBetting.deployed();
    });

    it("- Anyone that is not a better can not deposit ETH", async function () {
      await expect(
        etherBetting.connect(addr3).deposit({ value: better1.fundAmt })
      ).to.revertedWith("ChainlinkEtherBet: NOT_BETTER");
    });

    it("- A better should deposit ETH as the set amount in constructor", async function () {
      await expect(
        etherBetting.connect(addr1).deposit({ value: BigNumber.from(5) })
      ).to.revertedWith("ChainlinkEtherBet: INVALID_ETH");
    });
  });
}
