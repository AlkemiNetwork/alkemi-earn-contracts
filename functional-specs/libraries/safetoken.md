---
layout: default
title: SafeToken
---

# SafeToken.sol

View Source: [contracts/SafeToken.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/SafeToken.sol)

**↗ Extends:** [**ErrorReporter**](../contracts/errorreporter.md) **↘ Derived Contracts:** [**Liquidator**](../contracts/liquidator.md)**,** [**MoneyMarket**](../contracts/moneymarket.md)

## Functions

* [checkTransferIn\(address asset, address from, uint256 amount\)](safetoken.md#checktransferin)
* [doTransferIn\(address asset, address from, uint256 amount\)](safetoken.md#dotransferin)
* [getCash\(address asset\)](safetoken.md#getcash)
* [getBalanceOf\(address asset, address from\)](safetoken.md#getbalanceof)
* [doTransferOut\(address asset, address to, uint256 amount\)](safetoken.md#dotransferout)
* [doApprove\(address asset, address to, uint256 amount\)](safetoken.md#doapprove)

### checkTransferIn

Checks whether or not there is sufficient allowance for this contract to move amount from `from` and whether or not `from` has a balance of at least `amount`. Does NOT do a transfer.

```javascript
function checkTransferIn(address asset, address from, uint256 amount) internal view
returns(enum ErrorReporter.Error)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| from | address |  |
| amount | uint256 |  |

### doTransferIn

Similar to EIP20 transfer, except it handles a False result from `transferFrom` and returns an explanatory error code rather than reverting. If caller has not called `checkTransferIn`, this may revert due to insufficient balance or insufficient allowance. If caller has called `checkTransferIn` prior to this call, and it returned Error.NO\_ERROR, this should not revert in normal conditions.

* Note: This wrapper safely handles non-standard ERC-20 tokens that do not return a value.

  See here: [https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca)

```javascript
function doTransferIn(address asset, address from, uint256 amount) internal nonpayable
returns(enum ErrorReporter.Error)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| from | address |  |
| amount | uint256 |  |

### getCash

Checks balance of this contract in asset

```javascript
function getCash(address asset) internal view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |

### getBalanceOf

Checks balance of `from` in `asset`

```javascript
function getBalanceOf(address asset, address from) internal view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| from | address |  |

### doTransferOut

Similar to EIP20 transfer, except it handles a False result from `transfer` and returns an explanatory error code rather than reverting. If caller has not called checked protocol's balance, this may revert due to insufficient cash held in this contract. If caller has checked protocol's balance prior to this call, and verified it is &gt;= amount, this should not revert in normal conditions.

* Note: This wrapper safely handles non-standard ERC-20 tokens that do not return a value.

  See here: [https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca)

```javascript
function doTransferOut(address asset, address to, uint256 amount) internal nonpayable
returns(enum ErrorReporter.Error)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| to | address |  |
| amount | uint256 |  |

### doApprove

```javascript
function doApprove(address asset, address to, uint256 amount) internal nonpayable
returns(enum ErrorReporter.Error)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| to | address |  |
| amount | uint256 |  |

