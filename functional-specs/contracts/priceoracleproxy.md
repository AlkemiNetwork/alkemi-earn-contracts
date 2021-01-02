---
layout: default
title: PriceOracleProxy
---

# PriceOracleProxy.sol

View Source: [contracts/PriceOracleProxy.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/PriceOracleProxy.sol)

## Contract Members

**Constants & Variables**

```javascript
address public mostRecentCaller;
uint256 public mostRecentBlock;
contract PriceOracleInterface public realPriceOracle;
```

## Functions

* [assetPrices\(address asset\)](priceoracleproxy.md#assetprices)

### assetPrices

Gets the price of a given asset

```javascript
function assetPrices(address asset) public nonpayable
returns(uint256)
```

**Returns**

the price scaled by 10\*\*18, or zero if the price is not available

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset to get the price of |

