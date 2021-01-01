---
layout: default
title: LiquidationChecker
---

# LiquidationChecker.sol

View Source: [contracts/LiquidationChecker.sol](../contracts/LiquidationChecker.sol)

**↘ Derived Contracts: [AlkemiRateModel](AlkemiRateModel.md)**

**{{ContractName}}**

## Contract Members
**Constants & Variables**

```js
contract MoneyMarket public moneyMarket;
address public liquidator;
bool public allowLiquidation;

```

## Functions

- [isAllowed(address asset, uint256 newCash)](#isallowed)
- [isLiquidate(address asset, uint256 newCash)](#isliquidate)
- [cashIsUp(address asset, uint256 newCash)](#cashisup)
- [oracleTouched()](#oracletouched)
- [setAllowLiquidation(bool allowLiquidation_)](#setallowliquidation)

### isAllowed

```js
function isAllowed(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| newCash | uint256 |  | 

### isLiquidate

```js
function isLiquidate(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| newCash | uint256 |  | 

### cashIsUp

```js
function cashIsUp(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| newCash | uint256 |  | 

### oracleTouched

```js
function oracleTouched() internal view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### setAllowLiquidation

```js
function setAllowLiquidation(bool allowLiquidation_) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| allowLiquidation_ | bool |  | 

