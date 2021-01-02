---
layout: default
title: JumpRateModel
---

# Compound's JumpRateModel Contract (JumpRateModel.sol)

View Source: [contracts/JumpRateModel.sol](../contracts/JumpRateModel.sol)

**↗ Extends: [InterestRateModel](InterestRateModel.md)**

**{{ContractName}}**

## Contract Members
**Constants & Variables**

```js
uint256 public constant blocksPerYear;
uint256 public multiplierPerBlock;
uint256 public baseRatePerBlock;
uint256 public jumpMultiplierPerBlock;
uint256 public kink;

```

**Events**

```js
event NewInterestParams(uint256  baseRatePerBlock, uint256  multiplierPerBlock, uint256  jumpMultiplierPerBlock, uint256  kink);
```

## Functions

- [utilizationRate(uint256 cash, uint256 borrows, uint256 reserves)](#utilizationrate)
- [getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves)](#getborrowrate)
- [getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa)](#getsupplyrate)

### utilizationRate

Calculates the utilization rate of the market: `borrows / (cash + borrows - reserves)`

```js
function utilizationRate(uint256 cash, uint256 borrows, uint256 reserves) public pure
returns(uint256)
```

**Returns**

The utilization rate as a mantissa between [0, 1e18]

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cash | uint256 | The amount of cash in the market | 
| borrows | uint256 | The amount of borrows in the market | 
| reserves | uint256 | The amount of reserves in the market (currently unused) | 

### getBorrowRate

Calculates the current borrow rate per block, with the error code expected by the market

```js
function getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves) public view
returns(uint256)
```

**Returns**

The borrow rate percentage per block as a mantissa (scaled by 1e18)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cash | uint256 | The amount of cash in the market | 
| borrows | uint256 | The amount of borrows in the market | 
| reserves | uint256 | The amount of reserves in the market | 

### getSupplyRate

Calculates the current supply rate per block

```js
function getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa) public view
returns(uint256)
```

**Returns**

The supply rate percentage per block as a mantissa (scaled by 1e18)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cash | uint256 | The amount of cash in the market | 
| borrows | uint256 | The amount of borrows in the market | 
| reserves | uint256 | The amount of reserves in the market | 
| reserveFactorMantissa | uint256 | The current reserve factor for the market | 
