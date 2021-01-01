---
layout: default
title: Liquidator
---

# Liquidator.sol

View Source: [contracts/Liquidator.sol](../contracts/Liquidator.sol)

**↗ Extends: [ErrorReporter](ErrorReporter.md), [SafeToken](SafeToken.md)**

**{{ContractName}}**

## Contract Members
**Constants & Variables**

```js
contract MoneyMarket public moneyMarket;

```

**Events**

```js
event BorrowLiquidated(address  targetAccount, address  assetBorrow, uint256  borrowBalanceBefore, uint256  borrowBalanceAccumulated, uint256  amountRepaid, uint256  borrowBalanceAfter, address  liquidator, address  assetCollateral, uint256  collateralBalanceBefore, uint256  collateralBalanceAccumulated, uint256  amountSeized, uint256  collateralBalanceAfter);
```

## Functions

- [liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose)](#liquidateborrow)
- [tokenAllowAll(address asset, address allowee)](#tokenallowall)
- [tokenTransferAll(address asset, address recipient)](#tokentransferall)

### liquidateBorrow

```js
function liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| targetAccount | address |  | 
| assetBorrow | address |  | 
| assetCollateral | address |  | 
| requestedAmountClose | uint256 |  | 

### tokenAllowAll

```js
function tokenAllowAll(address asset, address allowee) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| allowee | address |  | 

### tokenTransferAll

```js
function tokenTransferAll(address asset, address recipient) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| recipient | address |  | 

