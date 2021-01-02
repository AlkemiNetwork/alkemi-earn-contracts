---
layout: default
title: LiquidationChecker
---

# LiquidationChecker.sol

View Source: [contracts/LiquidationChecker.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/LiquidationChecker.sol)

**↘ Derived Contracts:** [**AlkemiRateModel**](alkemiratemodel.md)

## Contract Members

**Constants & Variables**

```javascript
contract MoneyMarket public moneyMarket;
address public liquidator;
bool public allowLiquidation;
```

## Functions

* [isAllowed\(address asset, uint256 newCash\)](liquidationchecker.md#isallowed)
* [isLiquidate\(address asset, uint256 newCash\)](liquidationchecker.md#isliquidate)
* [cashIsUp\(address asset, uint256 newCash\)](liquidationchecker.md#cashisup)
* [oracleTouched\(\)](liquidationchecker.md#oracletouched)
* [setAllowLiquidation\(bool allowLiquidation\_\)](liquidationchecker.md#setallowliquidation)

### isAllowed

```javascript
function isAllowed(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| newCash | uint256 |  |

### isLiquidate

```javascript
function isLiquidate(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| newCash | uint256 |  |

### cashIsUp

```javascript
function cashIsUp(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| newCash | uint256 |  |

### oracleTouched

```javascript
function oracleTouched() internal view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### setAllowLiquidation

```javascript
function setAllowLiquidation(bool allowLiquidation_) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| allowLiquidation\_ | bool |  |

