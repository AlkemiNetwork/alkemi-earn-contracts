---
layout: default
title: PriceOracleInterface
---

# PriceOracleInterface.sol

View Source: [contracts/PriceOracleInterface.sol](../contracts/PriceOracleInterface.sol)

**{{ContractName}}**

## Functions

- [assetPrices(address asset)](#assetprices)

### assetPrices

Gets the price of a given asset

```js
function assetPrices(address asset) public view
returns(uint256)
```

**Returns**

the price scaled by 10**18, or zero if the price is not available

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | Asset to get the price of | 

