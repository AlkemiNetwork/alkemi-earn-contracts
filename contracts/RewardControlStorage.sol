pragma solidity 0.4.24;

import "./MoneyMarket.sol";

contract RewardControlStorage {

    struct MarketState {
        // @notice The market's last updated alkSupplyIndex or alkBorrowIndex
        uint224 index;

        // @notice The block number the index was last updated at
        uint32 block;
    }

    // @notice A list of all markets in the reward program
    address[] public allMarkets;

    // @notice The index for checking whether a market is already in the reward program
    mapping(address => bool) public allMarketsIndex;

    // @notice The rate at which the Reward Control distributes ALK per block
    uint public alkRate;

    // @notice The portion of alkRate that each market currently receives
    mapping(address => uint) public alkSpeeds;

    // @notice The ALK market supply state for each market
    mapping(address => MarketState) public alkSupplyState;

    // @notice The ALK market borrow state for each market
    mapping(address => MarketState) public alkBorrowState;

    // @notice The snapshot of ALK index for each market for each supplier as of the last time they accrued ALK
    mapping(address => mapping(address => uint)) public alkSupplierIndex;

    // @notice The snapshot of ALK index for each market for each borrower as of the last time they accrued ALK
    mapping(address => mapping(address => uint)) public alkBorrowerIndex;

    // @notice The ALK accrued but not yet transferred to each participant
    mapping(address => uint) public alkAccrued;

    // @notice To make sure initializer is called only once
    bool public initializationDone;

    // @notice The address of the current owner of this contract
    address public owner;

    // @notice The proposed address of the new owner of this contract
    address public newOwner;

    // @notice The underlying Money Market contract
    MoneyMarket public moneyMarket;

    // @notice The ALK token address
    address public alkAddress;

}