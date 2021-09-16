---
layout: default
title: PriceOracleProxy
---

# PriceOracleProxy.sol

View Source: [contracts/PriceOracleProxy.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/PriceOracleProxy.sol)



### Contract Members

**Constants & Variables**

```javascript
address public mostRecentCaller;
uint256 public mostRecentBlock;
contract PriceOracleInterface public realPriceOracle;
```

### Functions

* assetPrices\(address asset\)

#### assetPrices

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

