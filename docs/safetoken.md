---
layout: default
title: SafeToken
---

# SafeToken.sol

View Source: [contracts/SafeToken.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/SafeToken.sol)

**↗ Extends:** [**ErrorReporter**](errorreporter.md) **↘ Derived Contracts:** [**AlkemiEarnPublic**](alkemiearnpublic.md)**,** [**AlkemiEarnVerified**](alkemiearnverified.md)**,** [**Liquidator**](liquidator.md)



### Functions

* checkTransferIn\(address asset, address from, uint256 amount\)
* doTransferIn\(address asset, address from, uint256 amount\)
* getCash\(address asset\)
* getBalanceOf\(address asset, address from\)
* doTransferOut\(address asset, address to, uint256 amount\)
* doApprove\(address asset, address to, uint256 amount\)

#### checkTransferIn

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

#### doTransferIn

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

#### getCash

Checks balance of this contract in asset

```javascript
function getCash(address asset) internal view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |

#### getBalanceOf

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

#### doTransferOut

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

#### doApprove

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

