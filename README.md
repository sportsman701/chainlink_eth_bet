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

## Installation
```shell
yarn install
```

## Usage
This usage guide is for Mumbai testnet.

### 1. Build
```shell
yarn build
```

### 2. Test
```shell
yarn test
```

### 3. Deploy Contract
```shell
yarn deploy
```

### 4. Run Front End
```shell
yarn start
```