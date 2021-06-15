---
layout: default
title: RewardControlStorage
---

# RewardControlStorage.sol

View Source: [contracts/RewardControlStorage.sol](../contracts/RewardControlStorage.sol)

**↘ Derived Contracts: [RewardControl](RewardControl.md)**

**RewardControlStorage**

## Structs
### MarketState

```js
struct MarketState {
 uint224 index,
 uint32 block
}
```

## Contract Members
**Constants & Variables**

```js
address[] public allMarkets;
mapping(address => bool) public allMarketsIndex;
uint256 public alkRate;
mapping(address => uint256) public alkSpeeds;
mapping(address => struct RewardControlStorage.MarketState) public alkSupplyState;
mapping(address => struct RewardControlStorage.MarketState) public alkBorrowState;
mapping(address => mapping(address => uint256)) public alkSupplierIndex;
mapping(address => mapping(address => uint256)) public alkBorrowerIndex;
mapping(address => uint256) public alkAccrued;
bool public initializationDone;
address public owner;
address public newOwner;
contract MoneyMarketV12 public moneyMarket;
address public alkAddress;

```

## Functions