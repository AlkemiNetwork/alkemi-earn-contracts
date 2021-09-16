---
layout: default
title: LiquidationChecker
---

# LiquidationChecker.sol

View Source: [contracts/test/LiquidationChecker.sol](../contracts/test/LiquidationChecker.sol)

### Contract Members

**Constants & Variables**

```javascript
contract AlkemiEarnVerified public alkemiEarnVerified;
address public liquidator;
bool public allowLiquidation;
```

### Functions

* isAllowed\(address asset, uint256 newCash\)
* isLiquidate\(address asset, uint256 newCash\)
* cashIsUp\(address asset, uint256 newCash\)
* oracleTouched\(\)
* setAllowLiquidation\(bool allowLiquidation\_\)

#### isAllowed

```javascript
function isAllowed(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| newCash | uint256 |  |

#### isLiquidate

```javascript
function isLiquidate(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| newCash | uint256 |  |

#### cashIsUp

```javascript
function cashIsUp(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| newCash | uint256 |  |

#### oracleTouched

```javascript
function oracleTouched() internal view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### setAllowLiquidation

```javascript
function setAllowLiquidation(bool allowLiquidation_) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| allowLiquidation\_ | bool |  |

