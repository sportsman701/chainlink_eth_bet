import { constructorTest } from "./units/constructor.test";
import { depositTest } from "./units/deposit.test";
import { withdrawTest } from "./units/withdraw.test";
import { upgradableTest } from "./units/upgradable.test";

describe("1. Smart Contract", function () {
  constructorTest();
  depositTest();
  withdrawTest();
  upgradableTest();
});
