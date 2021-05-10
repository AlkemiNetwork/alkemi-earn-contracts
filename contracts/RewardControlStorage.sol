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

    /// The rate at which the flywheel distributes ALK, per block
    uint public alkRate; // 4.16191 = 8.323820396 / 2

    /// The portion of alkRate that each market currently receives
    mapping(address => uint) public alkSpeeds;

    /// The ALK market supply state for each market
    mapping(address => MarketState) public alkSupplyState;

    /// The ALK market borrow state for each market
    mapping(address => MarketState) public alkBorrowState;

    /// The ALK borrow index for each market for each supplier as of the last time they accrued ALK
    mapping(address => mapping(address => uint)) public alkSupplierIndex;

    /// The ALK borrow index for each market for each borrower as of the last time they accrued ALK
    mapping(address => mapping(address => uint)) public alkBorrowerIndex;

    /// The ALK accrued but not yet transferred to each user
    mapping(address => uint) public alkAccrued;

}