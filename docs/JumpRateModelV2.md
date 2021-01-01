---
layout: default
title: JumpRateModelV2
---

# Compound's JumpRateModel Contract V2 (JumpRateModelV2.sol)

View Source: [contracts/JumpRateModelV2.sol](../contracts/JumpRateModelV2.sol)

**↗ Extends: [InterestRateModel](InterestRateModel.md)**

**{{ContractName}}**

Version 2 modifies Version 1 by enabling updateable parameters.

## Contract Members
**Constants & Variables**

```js
address public owner;
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

- [updateJumpRateModel(uint256 baseRatePerYear, uint256 multiplierPerYear, uint256 jumpMultiplierPerYear, uint256 kink_)](#updatejumpratemodel)
- [utilizationRate(uint256 cash, uint256 borrows, uint256 reserves)](#utilizationrate)
- [getBorrowRate(uint256 cash, uint256 borrows, uint256 reserves)](#getborrowrate)
- [getSupplyRate(uint256 cash, uint256 borrows, uint256 reserves, uint256 reserveFactorMantissa)](#getsupplyrate)
- [updateJumpRateModelInternal(uint256 baseRatePerYear, uint256 multiplierPerYear, uint256 jumpMultiplierPerYear, uint256 kink_)](#updatejumpratemodelinternal)

### updateJumpRateModel

Update the parameters of the interest rate model (only callable by owner, i.e. Timelock)

```js
function updateJumpRateModel(uint256 baseRatePerYear, uint256 multiplierPerYear, uint256 jumpMultiplierPerYear, uint256 kink_) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| baseRatePerYear | uint256 | The approximate target base APR, as a mantissa (scaled by 1e18) | 
| multiplierPerYear | uint256 | The rate of increase in interest rate wrt utilization (scaled by 1e18) | 
| jumpMultiplierPerYear | uint256 | The multiplierPerBlock after hitting a specified utilization point | 
| kink_ | uint256 | The utilization point at which the jump multiplier is applied | 

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

### updateJumpRateModelInternal

Internal function to update the parameters of the interest rate model

```js
function updateJumpRateModelInternal(uint256 baseRatePerYear, uint256 multiplierPerYear, uint256 jumpMultiplierPerYear, uint256 kink_) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| baseRatePerYear | uint256 | The approximate target base APR, as a mantissa (scaled by 1e18) | 
| multiplierPerYear | uint256 | The rate of increase in interest rate wrt utilization (scaled by 1e18) | 
| jumpMultiplierPerYear | uint256 | The multiplierPerBlock after hitting a specified utilization point | 
| kink_ | uint256 | The utilization point at which the jump multiplier is applied | 

