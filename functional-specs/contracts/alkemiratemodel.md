---
layout: default
title: AlkemiRateModel
---

# Earn Interest Rate Model \(AlkemiRateModel.sol\)

View Source: [contracts/AlkemiRateModel.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2d3ff645a048226690e9171396ba37e482acfc4a/contracts/AlkemiRateModel.sol)

**↗ Extends:** [**Exponential**](../libraries/exponential.md)**,** [**LiquidationChecker**](liquidationchecker.md)

See Model here

## Constructor

```javascript
constructor(address moneyMarket, address liquidator) public
```

**Arguments**

**Enums**

### IRError

```javascript
enum IRError {
 NO_ERROR,
 FAILED_TO_ADD_CASH_PLUS_BORROWS,
 FAILED_TO_GET_EXP,
 FAILED_TO_MUL_PRODUCT_TIMES_BORROW_RATE
}
```

## Contract Members

**Constants & Variables**

```javascript
//internal members
uint256 internal constant blocksPerYear;
struct Exponential.Exp internal SpreadLow;
struct Exponential.Exp internal BreakPointLow;
struct Exponential.Exp internal ReserveLow;
struct Exponential.Exp internal ReserveMid;
struct Exponential.Exp internal SpreadMid;
struct Exponential.Exp internal BreakPointHigh;
struct Exponential.Exp internal ReserveHigh;
struct Exponential.ExpNegative internal SpreadHigh;
struct Exponential.Exp internal MinRateActual;
struct Exponential.Exp internal HealthyMinURActual;
struct Exponential.Exp internal HealthyMinRateActual;
struct Exponential.Exp internal MaxRateActual;
struct Exponential.Exp internal HealthyMaxURActual;
struct Exponential.Exp internal HealthyMaxRateActual;

//public members
address public owner;
address public newOwner;
string public contractName;
```

**Events**

```javascript
event OwnerUpdate(address indexed owner, address indexed newOwner);
event LiquidatorUpdate(address indexed owner, address indexed newLiquidator, address indexed oldLiquidator);
```

| Name | Type | Description |
| :--- | :--- | :--- |
| moneyMarket | address |  |
| liquidator | address |  |

## Modifiers

* [onlyOwner](alkemiratemodel.md#onlyowner)

### onlyOwner

```javascript
modifier onlyOwner() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


## Functions

* [changeRates\(string \_contractName, uint256 MinRate, uint256 HealthyMinUR, uint256 HealthyMinRate, uint256 HealthyMaxUR, uint256 HealthyMaxRate, uint256 MaxRate\)](alkemiratemodel.md#changerates)
* [transferOwnership\(address newOwner\_\)](alkemiratemodel.md#transferownership)
* [acceptOwnership\(\)](alkemiratemodel.md#acceptownership)
* [setLiquidator\(address \_liquidator\)](alkemiratemodel.md#setliquidator)
* [getUtilizationRate\(uint256 cash, uint256 borrows\)](alkemiratemodel.md#getutilizationrate)
* [getUtilizationAndAnnualBorrowRate\(uint256 cash, uint256 borrows\)](alkemiratemodel.md#getutilizationandannualborrowrate)
* [getSupplyRate\(address \_asset, uint256 cash, uint256 borrows\)](alkemiratemodel.md#getsupplyrate)
* [getBorrowRate\(address asset, uint256 cash, uint256 borrows\)](alkemiratemodel.md#getborrowrate)

### changeRates

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

### transferOwnership

```javascript
function transferOwnership(address newOwner_) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| newOwner\_ | address |  |

### acceptOwnership

```javascript
function acceptOwnership() external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### setLiquidator

```javascript
function setLiquidator(address _liquidator) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_liquidator | address |  |

### getUtilizationRate

```javascript
function getUtilizationRate(uint256 cash, uint256 borrows) internal pure
returns(enum AlkemiRateModel.IRError, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| cash | uint256 |  |
| borrows | uint256 |  |

### getUtilizationAndAnnualBorrowRate

```javascript
function getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows) internal view
returns(enum AlkemiRateModel.IRError, struct Exponential.Exp, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| cash | uint256 |  |
| borrows | uint256 |  |

### getSupplyRate

Gets the current supply interest rate based on the given asset, total cash and total borrows

```javascript
function getSupplyRate(address _asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the supply interest rate per block scaled by 10e18

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_asset | address | The asset to get the interest rate of |
| cash | uint256 | The total cash of the asset in the market |
| borrows | uint256 | The total borrows of the asset in the market |

### getBorrowRate

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

