---
layout: default
title: RewardControlInterface
---

# RewardControlInterface.sol

View Source: [contracts/RewardControlInterface.sol](../contracts/RewardControlInterface.sol)

**↘ Derived Contracts: [RewardControl](RewardControl.md)**

**RewardControlInterface**

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

## Contracts

* [AggregatorV3Interface](AggregatorV3Interface.md)
* [AlkemiEarnPublicV10](AlkemiEarnPublicV10.md)
* [AlkemiRateModel](AlkemiRateModel.md)
* [AlkemiWETH](AlkemiWETH.md)
* [CarefulMath](CarefulMath.md)
* [ChainLink](ChainLink.md)
* [EIP20Interface](EIP20Interface.md)
* [EIP20NonStandardInterface](EIP20NonStandardInterface.md)
* [ErrorReporter](ErrorReporter.md)
* [ExchangeRateModel](ExchangeRateModel.md)
* [Exponential](Exponential.md)
* [ExponentialNoError](ExponentialNoError.md)
* [InterestRateModel](InterestRateModel.md)
* [JumpRateModel](JumpRateModel.md)
* [JumpRateModelV2](JumpRateModelV2.md)
* [LiquidationChecker](LiquidationChecker.md)
* [Liquidator](Liquidator.md)
* [Migrations](Migrations.md)
* [MoneyMarket](MoneyMarket.md)
* [MoneyMarketV11](MoneyMarketV11.md)
* [MoneyMarketV12](MoneyMarketV12.md)
* [PriceOracle](PriceOracle.md)
* [PriceOracleInterface](PriceOracleInterface.md)
* [PriceOracleProxy](PriceOracleProxy.md)
* [RewardControl](RewardControl.md)
* [RewardControlInterface](RewardControlInterface.md)
* [RewardControlStorage](RewardControlStorage.md)
* [SafeMath](SafeMath.md)
* [SafeToken](SafeToken.md)
* [StableCoinInterestRateModel](StableCoinInterestRateModel.md)
* [StandardInterestRateModel](StandardInterestRateModel.md)
* [TestTokens](TestTokens.md)
