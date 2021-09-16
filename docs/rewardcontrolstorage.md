---
layout: default
title: RewardControlStorage
---

# RewardControlStorage.sol

View Source: [contracts/RewardControlStorage.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/RewardControlStorage.sol)

**↘ Derived Contracts:** [**RewardControl**](rewardcontrol.md)

### Structs

#### MarketState

```javascript
struct MarketState {
 uint224 index,
 uint32 block
}
```

### Contract Members

**Constants & Variables**

```javascript
mapping(bool => address[]) public allMarkets;
mapping(bool => mapping(address => bool)) public allMarketsIndex;
uint256 public alkRate;
mapping(bool => mapping(address => uint256)) public alkSpeeds;
mapping(bool => mapping(address => struct RewardControlStorage.MarketState)) public alkSupplyState;
mapping(bool => mapping(address => struct RewardControlStorage.MarketState)) public alkBorrowState;
mapping(bool => mapping(address => mapping(address => uint256))) public alkSupplierIndex;
mapping(bool => mapping(address => mapping(address => uint256))) public alkBorrowerIndex;
mapping(address => uint256) public alkAccrued;
bool public initializationDone;
address public owner;
address public newOwner;
contract AlkemiEarnVerified public alkemiEarnVerified;
contract AlkemiEarnPublic public alkemiEarnPublic;
address public alkAddress;
uint8 public MAXIMUM_NUMBER_OF_MARKETS;
```

### Functions

