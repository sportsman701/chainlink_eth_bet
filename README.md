# ETH Betting Smart System using [Chainlink](https://chain.link/)

## About
The betting system which allows 2 people to speculate on the price of an asset at a desired date.
The Contract should be created with target ETH price, target Date (Timestamp), two betters`s data (address, betting amount(MATIC), flag(the side that the better selected - true: over, false: below)).
Next, The betters should deposit MATIC Token to contract by the target date.
The ETH price will be decided by the Chainlink Data Feeds.
After the target date, the winner can deposit all deposited MATIC, other can not withdraw any MATIC.

If one better did not deposit MATIC by the target date, other can withdraw self MATIC from the contract after the target date.

## Chainlink
About Polygon Mainnet and Mumbai Testnet Data Feeds, you can see in [here](https://docs.chain.link/docs/matic-addresses/)

In this project, the following data feed are using
> Network: Mumbai   
> Aggregator: ETH/USD    
> Testnet Address: [0x0715A7794a1dc8e42615F059dD6e406A6594651A](https://mumbai.polygonscan.com/address/0x0715A7794a1dc8e42615F059dD6e406A6594651A)

## Implement
- Smart Contract  
> Language: Solidity  
> Framework: Hardhat  
> Networks: Mumbai(Testnet), Polygon(Mainnet)  
> Unit Test: Hardhat, Chai

- Front End
> Language: React  
> Framework: Nextjs  
> Network: Mumbai(Testnet)  
> Unit Test: Cypress  

## Installation
```shell
yarn install
```

## Usage

### 1. Environment variables
- Create a `.env` file in `pacakges/smart-contract` with its values (refer `.env.sample` file)
```
DEPLOYER_PRIVATE_KEY=[YOUR_DEPLOYER_PRIVATE_KEY]
REPORT_GAS=<true_or_false>
```
- Create a `.env` file in `pacakges/front-end` with its values (refer `.env.sample` file)
```
REACT_APP_NETWORK_URL=[NETWORK_RPC_URL]
REACT_APP_CHAIN_ID=[NETWORK_CHAIN_ID]
```

### 2. Build
Build Smart Contract and Front End Code
```shell
yarn build
```

### 3. Test
Unit Test in Smart Contract and Front End
```shell
yarn test
```

### 4. Deploy Contract
Deploy Smart Contract on Mumbai testnet and publish the contract`s ABI to the Front End side.
- Config params in `packages/smart-contract/scripts/params.ts` file for deploying
```
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
```
- Run Deploy Command
```shell
yarn deploy
```

### 5. Run Front End
```shell
yarn start
```

## Result
Deployed [ChainlinkEtherBet Contract at 0x45b20C5Fb9E5A9d77a7428a8631262f0C1Da5c3c on Mumbai(Testnet)](https://mumbai.polygonscan.com/address/0x45b20C5Fb9E5A9d77a7428a8631262f0C1Da5c3c) (Upgradable)

![Image](./screenshots/Screenshot%202022-03-23%20012259.jpg)