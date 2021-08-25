pragma solidity 0.4.24;

import "./AlkemiEarnVerified.sol";
import "./AlkemiEarnPublic.sol";

contract RewardControlStorage {
    struct MarketState {
        // @notice The market's last updated alkSupplyIndex or alkBorrowIndex
        uint224 index;
        // @notice The block number the index was last updated at
        uint32 block;
    }

    // @notice A list of all markets in the reward program mapped to respective verified/public protocols
    // @notice true => address[] represents Verified Protocol markets
    // @notice false => address[] represents Public Protocol markets
    mapping(bool => address[]) public allMarkets;

    // @notice The index for checking whether a market is already in the reward program
    // @notice The first mapping represents verified / public market and the second gives the existence of the market
    mapping(bool => mapping(address => bool)) public allMarketsIndex;

    // @notice The rate at which the Reward Control distributes ALK per block
    uint256 public alkRate;

    // @notice The portion of alkRate that each market currently receives
    // @notice The first mapping represents verified / public market and the second gives the alkSpeeds
    mapping(bool => mapping(address => uint256)) public alkSpeeds;

    // @notice The ALK market supply state for each market
    // @notice The first mapping represents verified / public market and the second gives the supplyState
    mapping(bool => mapping(address => MarketState)) public alkSupplyState;

    // @notice The ALK market borrow state for each market
    // @notice The first mapping represents verified / public market and the second gives the borrowState
    mapping(bool => mapping(address => MarketState)) public alkBorrowState;

    // @notice The snapshot of ALK index for each market for each supplier as of the last time they accrued ALK
    // @notice verified/public => market => supplier => supplierIndex
    mapping(bool => mapping(address => mapping(address => uint256))) public alkSupplierIndex;

    // @notice The snapshot of ALK index for each market for each borrower as of the last time they accrued ALK
    // @notice verified/public => market => borrower => borrowerIndex
    mapping(bool => mapping(address => mapping(address => uint256))) public alkBorrowerIndex;

    // @notice The ALK accrued but not yet transferred to each participant
    mapping(address => uint256) public alkAccrued;

    // @notice To make sure initializer is called only once
    bool public initializationDone;

    // @notice The address of the current owner of this contract
    address public owner;

    // @notice The proposed address of the new owner of this contract
    address public newOwner;

    // @notice The underlying AlkemiEarnVerified contract
    AlkemiEarnVerified public alkemiEarnVerified;

    // @notice The underlying AlkemiEarnPublic contract
    AlkemiEarnPublic public alkemiEarnPublic;

    // @notice The ALK token address
    address public alkAddress;

    // Hard cap on the maximum number of markets
    uint8 public MAXIMUM_NUMBER_OF_MARKETS = 16;
}
