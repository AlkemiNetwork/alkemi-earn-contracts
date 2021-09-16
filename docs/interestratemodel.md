---
layout: default
title: InterestRateModel
---

# InterestRateModel Interface \(InterestRateModel.sol\)

View Source: [contracts/InterestRateModel.sol](../contracts/InterestRateModel.sol)

Any interest rate model should derive from this contract.

### Functions

* getSupplyRate\(address asset, uint256 cash, uint256 borrows\)
* getBorrowRate\(address asset, uint256 cash, uint256 borrows\)

#### getSupplyRate

Gets the current supply interest rate based on the given asset, total cash and total borrows

```javascript
function getSupplyRate(address asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the supply interest rate per block scaled by 10e18

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The asset to get the interest rate of |
| cash | uint256 | The total cash of the asset in the market |
| borrows | uint256 | The total borrows of the asset in the market |

#### getBorrowRate

Gets the current borrow interest rate based on the given asset, total cash and total borrows

```javascript
function getBorrowRate(address asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the borrow interest rate per block scaled by 10e18

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The asset to get the interest rate of |
| cash | uint256 | The total cash of the asset in the market |
| borrows | uint256 | The total borrows of the asset in the market |

