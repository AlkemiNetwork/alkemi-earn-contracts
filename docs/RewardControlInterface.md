---
layout: default
title: RewardControlInterface
---

# RewardControlInterface.sol

View Source: [contracts/RewardControlInterface.sol](../contracts/RewardControlInterface.sol)

**↘ Derived Contracts: [RewardControl](RewardControl.md)**

**{{ContractName}}**

## Functions

- [refreshAlkSupplyIndex(address market, address supplier)](#refreshalksupplyindex)
- [refreshAlkBorrowIndex(address market, address borrower)](#refreshalkborrowindex)
- [claimAlk(address holder)](#claimalk)
- [claimAlk(address holder, address market)](#claimalk)

### refreshAlkSupplyIndex

⤿ Overridden Implementation(s): [RewardControl.refreshAlkSupplyIndex](RewardControl.md#refreshalksupplyindex)

Refresh ALK supply index for the specified market and supplier

```js
function refreshAlkSupplyIndex(address market, address supplier) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The market whose supply index to update | 
| supplier | address | The address of the supplier to distribute ALK to | 

### refreshAlkBorrowIndex

⤿ Overridden Implementation(s): [RewardControl.refreshAlkBorrowIndex](RewardControl.md#refreshalkborrowindex)

Refresh ALK borrow index for the specified market and borrower

```js
function refreshAlkBorrowIndex(address market, address borrower) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The market whose borrow index to update | 
| borrower | address | The address of the borrower to distribute ALK to | 

### claimAlk

⤿ Overridden Implementation(s): [RewardControl.claimAlk](RewardControl.md#claimalk)

Claim all the ALK accrued by holder in all markets

```js
function claimAlk(address holder) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| holder | address | The address to claim ALK for | 

### claimAlk

⤿ Overridden Implementation(s): [RewardControl.claimAlk](RewardControl.md#claimalk)

Claim all the ALK accrued by holder by refreshing the indexes on the specified market only

```js
function claimAlk(address holder, address market) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| holder | address | The address to claim ALK for | 
| market | address | The address of the market to refresh the indexes for | 

