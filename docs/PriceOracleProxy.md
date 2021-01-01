---
layout: default
title: PriceOracleProxy
---

# PriceOracleProxy.sol

View Source: [contracts/PriceOracleProxy.sol](../contracts/PriceOracleProxy.sol)

**{{ContractName}}**

## Contract Members
**Constants & Variables**

```js
address public mostRecentCaller;
uint256 public mostRecentBlock;
contract PriceOracleInterface public realPriceOracle;

```

## Functions

- [assetPrices(address asset)](#assetprices)

### assetPrices

Gets the price of a given asset

```js
function assetPrices(address asset) public nonpayable
returns(uint256)
```

**Returns**

the price scaled by 10**18, or zero if the price is not available

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | Asset to get the price of | 

