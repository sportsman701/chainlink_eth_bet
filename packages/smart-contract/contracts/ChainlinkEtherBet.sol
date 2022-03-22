//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./libraries/SafeMath.sol";

contract ChainlinkEtherBet is ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    // Ether Betting Data Structure
    struct EtherBet {
        address addr;
        uint256 fundAmt;
        bool flag;
    }

    // betters
    EtherBet[2] public betters;
    bool[2] public isDeposited;

    // the end timestamp of the betting
    uint256 public endTp;
    // the TP of Ether price
    uint256 public tpPrice;
    // the total ETH of betting;
    uint256 public totalEth;
    // the total deposited ETH;
    uint256 public depositedEth;
    // the flag of withdraw
    bool public isWithdrew;

    // Chainlink Data Feed
    AggregatorV3Interface internal priceFeed;

    // **************************  Events  ****************************************************************
    event Deposit(address _better, uint256 _amount);
    event Withdraw(address _winner, uint256 _amount);
    event Receive(uint256 _amount);

    // **************************  Initialize (Upgradeable - Proxy pattern)  ****************************************************************
    function initialize(EtherBet[] memory _betters, uint256 _endTp, uint256 _tpPrice) public initializer {
        require(_betters.length == 2, "ChainlinkEtherBet: MUST_BE_TWO_BETTERS");
        require(_betters[0].addr != address(0) && _betters[1].addr != address(0), "ChainlinkEtherBet: ZERO_ADDRESS");
        require(_betters[0].fundAmt > 0 && _betters[1].fundAmt > 0, "ChainlinkEtherBet: ZERO_BET_AMOUNT");
        require(_betters[0].addr != _betters[1].addr, "ChainlinkEtherBet: SAME_ADDRESS");
        require(_betters[0].flag != _betters[1].flag, "ChainlinkEtherBet: INVALID_FLAG");
        require(_endTp > block.timestamp, "ChainlinkEtherBet: INVALID_TIMESTAMP");
        require(_tpPrice != 0, "ChainlinkEtherBet: INVALID_PT_ETH");

        betters[0] = _betters[0];
        betters[1] = _betters[1];
        endTp = _endTp;
        tpPrice = _tpPrice;
        totalEth = _betters[0].fundAmt.add(_betters[1].fundAmt);

        /**
         * Aggregator: ETH/USD
         * Mainnet(Polygon) Address: 0xF9680D99D6C9589e2a93a78A04A279e509205945
         * Testnet(Mumbai)  Address: 0x0715A7794a1dc8e42615F059dD6e406A6594651A
         * Network: Mumbai
         */
        priceFeed = AggregatorV3Interface(0x0715A7794a1dc8e42615F059dD6e406A6594651A);

        // ReentrancyGuard Initialize
        __ReentrancyGuard_init();
    }

    // **************************  Functions  ****************************************************************
    function getBetterIndex(address _better) public view returns (uint256 index){
        if(_better == betters[0].addr){
            index = 0;
        } else if(_better == betters[1].addr){
            index = 1;
        } else {
            revert("ChainlinkEtherBet: NOT_BETTER");
        }
    }

    // Get Better Data
    function getBetterData(uint256 index) external view returns (address, uint256, bool, bool){
        return (betters[index].addr, betters[index].fundAmt, betters[index].flag, isDeposited[index]);
    }

    // A better deposit ETH
    /// @dev A better deposit ETH
    function deposit() external payable nonReentrant {
        uint256 index = getBetterIndex(msg.sender);

        require(msg.value == betters[index].fundAmt, "ChainlinkEtherBet: INVALID_ETH");
        require(isDeposited[index] == false, "ChainlinkEtherBet: ALREADY_DEPOSITED");

        // Can not deposit after the betting end
        ( , uint256 timestamp) = getLatestPrice();
        require(timestamp < endTp, "ChainlinkEtherBet: ALREADY_END");

        // Set Deposited Flag
        isDeposited[index] = true;
        depositedEth = depositedEth.add(msg.value);
        // Deposit ETH to contract
        payable(address(this)).transfer(msg.value);

        emit Deposit(msg.sender, msg.value);
    }

    /// @dev Betters withdraw Ether from the pool
    function withdraw() external payable nonReentrant {
        uint256 index = getBetterIndex(msg.sender);

        require(isDeposited[index] == true, "ChainlinkEtherBet: DID_NOT_DEPOSIT");
        require(isWithdrew == false, "ChainlinkEtherBet: ALREADY_WITHDREW");

        uint256 returnEth = 0;
        // If another better did not deposit by the end of betting
        if(depositedEth != totalEth){
            // Return ETH to a better
            returnEth = betters[index].fundAmt;
        } else {
            // Check Timestamp
            (int256 ethPrice, uint256 timestamp) = getLatestPrice();
            require(timestamp >= endTp, "ChainlinkEtherBet: STILL_NOT_END");

            // Check winner
            bool priceFlag = ethPrice > 0 && uint256(ethPrice) > (tpPrice.mul(1e10));
            require(betters[index].flag == priceFlag, "ChainlinkEtherBet: NOT_WINNER");

            // Send all ETH to a winner
            returnEth = totalEth;
        }

        isWithdrew = true;
        // Send ETH
        payable(msg.sender).transfer(returnEth);

        emit Withdraw(msg.sender, returnEth);
    }

    // **************************  Get Ether Price function (by using Chainlink Data Feed)  ****************************************************************
    // Get the latest eth price
    /// @return the 1st param: ETH price (Decimal:8)
    /// @return the 2nd param: Updated Timestamp
    function getLatestPrice() public view returns (int256, uint256) {
        (/*uint80 roundID*/, int256 price, /*uint256 startedAt*/, uint256 timeStamp, /*uint80 answeredInRound*/) = priceFeed.latestRoundData();
        return (price, timeStamp);
    }

    // **************************  Receive Ether functions  ****************************************************************
    fallback() external payable {
        emit Receive(msg.value);
    }
    receive() external payable {
        emit Receive(msg.value);
    }
}
