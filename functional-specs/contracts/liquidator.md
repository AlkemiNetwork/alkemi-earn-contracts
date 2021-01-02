---
layout: default
title: Liquidator
---

# Liquidator.sol

View Source: [contracts/Liquidator.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/Liquidator.sol)

**↗ Extends:** [**ErrorReporter**](errorreporter.md)**,** [**SafeToken**](../libraries/safetoken.md)

## Contract Members

**Constants & Variables**

```javascript
contract MoneyMarket public moneyMarket;
```

**Events**

```javascript
event BorrowLiquidated(address  targetAccount, address  assetBorrow, uint256  borrowBalanceBefore, uint256  borrowBalanceAccumulated, uint256  amountRepaid, uint256  borrowBalanceAfter, address  liquidator, address  assetCollateral, uint256  collateralBalanceBefore, uint256  collateralBalanceAccumulated, uint256  amountSeized, uint256  collateralBalanceAfter);
```

## Functions

* [liquidateBorrow\(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose\)](liquidator.md#liquidateborrow)
* [tokenAllowAll\(address asset, address allowee\)](liquidator.md#tokenallowall)
* [tokenTransferAll\(address asset, address recipient\)](liquidator.md#tokentransferall)

### liquidateBorrow

```javascript
function liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose) public nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| targetAccount | address |  |
| assetBorrow | address |  |
| assetCollateral | address |  |
| requestedAmountClose | uint256 |  |

### tokenAllowAll

```javascript
function tokenAllowAll(address asset, address allowee) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| allowee | address |  |

### tokenTransferAll

```javascript
function tokenTransferAll(address asset, address recipient) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| recipient | address |  |

