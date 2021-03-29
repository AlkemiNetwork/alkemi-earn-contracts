---
layout: default
title: StandardInterestRateModel
---

# The Compound Standard Interest Rate Model (StandardInterestRateModel.sol)

View Source: [contracts/StandardInterestRateModel.sol](../contracts/StandardInterestRateModel.sol)

**↗ Extends: [Exponential](Exponential.md)**

**{{ContractName}}**

See Section 2.4 of the Compound Whitepaper

**Enums**
### IRError

```js
enum IRError {
 NO_ERROR,
 FAILED_TO_ADD_CASH_PLUS_BORROWS,
 FAILED_TO_GET_EXP,
 FAILED_TO_MUL_PRODUCT_TIMES_BORROW_RATE
}
```

## Contract Members
**Constants & Variables**

```js
uint256 internal constant oneMinusSpreadBasisPoints;
uint256 internal constant blocksPerYear;
uint256 internal constant mantissaFivePercent;

```

## Functions

- [getUtilizationRate(uint256 cash, uint256 borrows)](#getutilizationrate)
- [getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows)](#getutilizationandannualborrowrate)
- [getSupplyRate(address _asset, uint256 cash, uint256 borrows)](#getsupplyrate)
- [getBorrowRate(address _asset, uint256 cash, uint256 borrows)](#getborrowrate)

### getUtilizationRate

```js
function getUtilizationRate(uint256 cash, uint256 borrows) internal pure
returns(enum StandardInterestRateModel.IRError, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cash | uint256 |  | 
| borrows | uint256 |  | 

### getUtilizationAndAnnualBorrowRate

```js
function getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows) internal pure
returns(enum StandardInterestRateModel.IRError, struct Exponential.Exp, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cash | uint256 |  | 
| borrows | uint256 |  | 

### getSupplyRate

Gets the current supply interest rate based on the given asset, total cash and total borrows

```js
function getSupplyRate(address _asset, uint256 cash, uint256 borrows) public pure
returns(uint256, uint256)
```

**Returns**

Success or failure and the supply interest rate per block scaled by 10e18

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _asset | address | The asset to get the interest rate of | 
| cash | uint256 | The total cash of the asset in the market | 
| borrows | uint256 | The total borrows of the asset in the market | 

### getBorrowRate

Gets the current borrow interest rate based on the given asset, total cash and total borrows

```js
function getBorrowRate(address _asset, uint256 cash, uint256 borrows) public pure
returns(uint256, uint256)
```

**Returns**

Success or failure and the borrow interest rate per block scaled by 10e18

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _asset | address | The asset to get the interest rate of | 
| cash | uint256 | The total cash of the asset in the market | 
| borrows | uint256 | The total borrows of the asset in the market | 

