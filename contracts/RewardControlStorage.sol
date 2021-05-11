pragma solidity ^0.4.24;

contract RewardControlStorage {

    struct MarketState {
        /// The market's last updated alkBorrowIndex or alkSupplyIndex
        uint224 index;

        /// The block number the index was last updated at
        uint32 block;
    }

    /// A list of all markets
    address[] public allMarkets;

    // The index for all markets, to check for its existence
    mapping(address => bool) allMarketsIndex;

    /// The rate at which the flywheel distributes ALK, per block
    uint public alkRate; // 4.16191 = 8.323820396 / 2

    /// The portion of alkRate that each market currently receives
    mapping(address => uint) public alkSpeeds;

    /// The ALK market state for each market
    mapping(address => MarketState) public alkMarketState;

    /// The ALK index for each market for each participant as of the last time they accrued ALK
    mapping(address => mapping(address => uint)) public alkParticipantIndex;

    /// The ALK accrued but not yet transferred to each user
    mapping(address => uint) public alkAccrued;

    address public owner;

    MoneyMarket public moneyMarket;

    address public alkAddress;

}