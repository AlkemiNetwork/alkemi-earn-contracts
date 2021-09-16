---
layout: default
title: PriceOracleInterface
---

# PriceOracleInterface.sol

View Source: [contracts/test/PriceOracleInterface.sol](../contracts/test/PriceOracleInterface.sol)

### Functions

* assetPrices\(address asset\)

#### assetPrices

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

