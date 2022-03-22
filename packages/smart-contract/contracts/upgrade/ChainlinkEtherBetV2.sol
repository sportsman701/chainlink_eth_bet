//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../ChainlinkEtherBet.sol";

// ChainlinkEtherBet Version 2
// @dev based on ChainlinkEtherBet
contract ChainlinkEtherBetV2 is ChainlinkEtherBet {
    event SetPriceFeed(address _feedAddress);
    // Add new function for setting chainlink data feed
    function setPriceFeed(address _feedAddress) external {
        require(_feedAddress != address(0), "ChainlinkEtherBetV2: INVAILD_FEED");

        priceFeed = AggregatorV3Interface(_feedAddress);

        emit SetPriceFeed(_feedAddress);
    }
}
