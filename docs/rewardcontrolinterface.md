---
layout: default
title: RewardControlInterface
---

# RewardControlInterface.sol

View Source: [contracts/RewardControlInterface.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/RewardControlInterface.sol)

**↘ Derived Contracts:** [**RewardControl**](rewardcontrol.md)

### Functions

* refreshAlkSupplyIndex\(address market, address supplier, bool isVerified\)
* refreshAlkBorrowIndex\(address market, address borrower, bool isVerified\)
* claimAlk\(address holder\)
* claimAlk\(address holder, address market, bool isVerified\)

#### refreshAlkSupplyIndex

⤿ Overridden Implementation\(s\): [RewardControl.refreshAlkSupplyIndex](RewardControl.md#refreshalksupplyindex)

Refresh ALK supply index for the specified market and supplier

```javascript
function refreshAlkSupplyIndex(address market, address supplier, bool isVerified) external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The market whose supply index to update |
| supplier | address | The address of the supplier to distribute ALK to |
| isVerified | bool | Verified / Public protocol |

#### refreshAlkBorrowIndex

⤿ Overridden Implementation\(s\): [RewardControl.refreshAlkBorrowIndex](RewardControl.md#refreshalkborrowindex)

Refresh ALK borrow index for the specified market and borrower

```javascript
function refreshAlkBorrowIndex(address market, address borrower, bool isVerified) external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The market whose borrow index to update |
| borrower | address | The address of the borrower to distribute ALK to |
| isVerified | bool | Verified / Public protocol |

#### claimAlk

⤿ Overridden Implementation\(s\): [RewardControl.claimAlk](RewardControl.md#claimalk)

Claim all the ALK accrued by holder in all markets

```javascript
function claimAlk(address holder) external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| holder | address | The address to claim ALK for |

#### claimAlk

⤿ Overridden Implementation\(s\): [RewardControl.claimAlk](RewardControl.md#claimalk)

Claim all the ALK accrued by holder by refreshing the indexes on the specified market only

```javascript
function claimAlk(address holder, address market, bool isVerified) external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| holder | address | The address to claim ALK for |
| market | address | The address of the market to refresh the indexes for |
| isVerified | bool | Verified / Public protocol |

