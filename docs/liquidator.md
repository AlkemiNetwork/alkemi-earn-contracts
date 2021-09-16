---
layout: default
title: Liquidator
---

# Liquidator.sol

View Source: [contracts/test/Liquidator.sol](../contracts/test/Liquidator.sol)

**↗ Extends:** [**ErrorReporter**](ErrorReporter.md)**,** [**SafeToken**](SafeToken.md)

### Contract Members

**Constants & Variables**

```javascript
contract AlkemiEarnVerified public alkemiEarnVerified;
```

**Events**

```javascript
event BorrowLiquidated(address  targetAccount, address  assetBorrow, uint256  borrowBalanceBefore, uint256  borrowBalanceAccumulated, uint256  amountRepaid, uint256  borrowBalanceAfter, address  liquidator, address  assetCollateral, uint256  collateralBalanceBefore, uint256  collateralBalanceAccumulated, uint256  amountSeized, uint256  collateralBalanceAfter);
```

### Functions

* liquidateBorrow\(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose\)
* tokenAllowAll\(address asset, address allowee\)
* tokenTransferAll\(address asset, address recipient\)

#### liquidateBorrow

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

#### tokenAllowAll

```javascript
function tokenAllowAll(address asset, address allowee) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| allowee | address |  |

#### tokenTransferAll

```javascript
function tokenTransferAll(address asset, address recipient) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| recipient | address |  |

