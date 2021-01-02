---
layout: default
title: PriceOracleInterface
---

# PriceOracleInterface.sol

View Source: [contracts/PriceOracleInterface.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/PriceOracleInterface.sol)

## Functions

* [assetPrices\(address asset\)](priceoracleinterface.md#assetprices)

### assetPrices

Gets the price of a given asset

```javascript
function assetPrices(address asset) public view
returns(uint256)
```

**Returns**

the price scaled by 10\*\*18, or zero if the price is not available

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset to get the price of |

