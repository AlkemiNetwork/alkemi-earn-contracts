pragma solidity 0.4.24;

import "./MoneyMarket.sol";

contract RewardControlStorage {

    struct MarketState {
        /// The market's last updated alkSupplyIndex or alkBorrowIndex
        uint224 index;

        /// The block number the index was last updated at
        uint32 block;
    }

    /// A list of all markets in the reward program
    address[] public allMarkets;

    // The index for checking whether a market is already in the reward program
    mapping(address => bool) public allMarketsIndex;

    /// The rate at which the Reward Control distributes ALK per block
    uint public alkRate;

    /// The portion of alkRate that each market currently receives
    mapping(address => uint) public alkSpeeds;

    /// The ALK market supply state for each market
    mapping(address => MarketState) public alkSupplyState;

    /// The ALK market borrow state for each market
    mapping(address => MarketState) public alkBorrowState;

    /// The snapshot of ALK index for each market for each supplier as of the last time they accrued ALK
    mapping(address => mapping(address => uint)) public alkSupplierIndex;

    /// The snapshot of ALK index for each market for each borrower as of the last time they accrued ALK
    mapping(address => mapping(address => uint)) public alkBorrowerIndex;

    /// The ALK accrued but not yet transferred to each participant
    mapping(address => uint) public alkAccrued;

    // To make sure initializer is called only once
    bool public initializationDone;

    // The address of the current owner of this contract
    address public owner;

    // The proposed address of the new owner of this contract
    address public newOwner;

    // The underlying Money Market contract
    MoneyMarket public moneyMarket;

    // The ALK token address
    address public alkAddress;

}