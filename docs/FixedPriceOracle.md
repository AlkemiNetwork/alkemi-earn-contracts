---
layout: default
title: FixedPriceOracle
---

# FixedPriceOracle.sol

View Source: [contracts/Oracle/FixedPriceOracle.sol](../contracts/Oracle/FixedPriceOracle.sol)

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

