---
layout: default
title: AlkemiRateModel
---

# Earn Interest Rate Model \(AlkemiRateModel.sol\)

View Source: [contracts/AlkemiRateModel.sol](../contracts/AlkemiRateModel.sol)

**↗ Extends:** [**Exponential**](Exponential.md)

See Model here

**Enums**

#### IRError

```javascript
enum IRError {
 NO_ERROR,
 FAILED_TO_ADD_CASH_PLUS_BORROWS,
 FAILED_TO_GET_EXP,
 FAILED_TO_MUL_PRODUCT_TIMES_BORROW_RATE
}
```

### Contract Members

**Constants & Variables**

```javascript
//public members
uint256 public blocksPerYear;
address public owner;
address public newOwner;
string public contractName;

//private members
uint8 private hundred;

//internal members
struct Exponential.Exp internal SpreadLow;
struct Exponential.Exp internal BreakPointLow;
struct Exponential.Exp internal ReserveLow;
struct Exponential.Exp internal ReserveMid;
struct Exponential.Exp internal SpreadMid;
struct Exponential.Exp internal BreakPointHigh;
struct Exponential.Exp internal ReserveHigh;
struct Exponential.Exp internal SpreadHigh;
struct Exponential.Exp internal MinRateActual;
struct Exponential.Exp internal HealthyMinURActual;
struct Exponential.Exp internal HealthyMinRateActual;
struct Exponential.Exp internal MaxRateActual;
struct Exponential.Exp internal HealthyMaxURActual;
struct Exponential.Exp internal HealthyMaxRateActual;
```

**Events**

```javascript
event OwnerUpdate(address indexed owner, address indexed newOwner);
event blocksPerYearUpdated(uint256  oldBlocksPerYear, uint256  newBlocksPerYear);
```

### Modifiers

* onlyOwner

#### onlyOwner

```javascript
modifier onlyOwner() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### Functions

* changeRates\(string \_contractName, uint256 MinRate, uint256 HealthyMinUR, uint256 HealthyMinRate, uint256 HealthyMaxUR, uint256 HealthyMaxRate, uint256 MaxRate\)
* changeBlocksPerYear\(uint256 \_blocksPerYear\)
* transferOwnership\(address newOwner\_\)
* acceptOwnership\(\)
* getUtilizationRate\(uint256 cash, uint256 borrows\)
* getUtilizationAndAnnualBorrowRate\(uint256 cash, uint256 borrows\)
* getSupplyRate\(address \_asset, uint256 cash, uint256 borrows\)
* getBorrowRate\(address asset, uint256 cash, uint256 borrows\)

#### changeRates

```javascript
function changeRates(string _contractName, uint256 MinRate, uint256 HealthyMinUR, uint256 HealthyMinRate, uint256 HealthyMaxUR, uint256 HealthyMaxRate, uint256 MaxRate) public nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_contractName | string |  |
| MinRate | uint256 |  |
| HealthyMinUR | uint256 |  |
| HealthyMinRate | uint256 |  |
| HealthyMaxUR | uint256 |  |
| HealthyMaxRate | uint256 |  |
| MaxRate | uint256 |  |

#### changeBlocksPerYear

```javascript
function changeBlocksPerYear(uint256 _blocksPerYear) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_blocksPerYear | uint256 |  |

#### transferOwnership

```javascript
function transferOwnership(address newOwner_) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| newOwner\_ | address |  |

#### acceptOwnership

```javascript
function acceptOwnership() external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### getUtilizationRate

```javascript
function getUtilizationRate(uint256 cash, uint256 borrows) internal view
returns(enum AlkemiRateModel.IRError, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| cash | uint256 |  |
| borrows | uint256 |  |

#### getUtilizationAndAnnualBorrowRate

```javascript
function getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows) internal view
returns(enum AlkemiRateModel.IRError, struct Exponential.Exp, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| cash | uint256 |  |
| borrows | uint256 |  |

#### getSupplyRate

Gets the current supply interest rate based on the given asset, total cash and total borrows

```javascript
function getSupplyRate(address _asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the supply interest rate per block scaled by 1e18

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_asset | address | The asset to get the interest rate of |
| cash | uint256 | The total cash of the asset in the market |
| borrows | uint256 | The total borrows of the asset in the market |

#### getBorrowRate

Gets the current borrow interest rate based on the given asset, total cash and total borrows

```javascript
function getBorrowRate(address asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the borrow interest rate per block scaled by 1e18

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The asset to get the interest rate of |
| cash | uint256 | The total cash of the asset in the market |
| borrows | uint256 | The total borrows of the asset in the market |

