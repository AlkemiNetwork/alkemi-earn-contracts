# AlkemiRateModel.sol

View Source: [contracts/AlkemiRateModel.sol](../contracts/AlkemiRateModel.sol)

**↗ Extends: [Exponential](Exponential.md), [LiquidationChecker](LiquidationChecker.md)**

**AlkemiRateModel**

## Constructor

```js
constructor(address moneyMarket, address liquidator) public
```

**Arguments**

**Enums**
### IRError

```js
enum IRError {
 NO_ERROR,
 FAILED_TO_ADD_CASH_PLUS_BORROWS,
 FAILED_TO_GET_EXP,
 FAILED_TO_MUL_PRODUCT_TIMES_BORROW_RATE
}
```

## Contract Members
**Constants & Variables**

```js
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

```js
event OwnerUpdate(address indexed owner, address indexed newOwner);
event LiquidatorUpdate(address indexed owner, address indexed newLiquidator, address indexed oldLiquidator);
```

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| moneyMarket | address |  | 
| liquidator | address |  | 

## Modifiers

- [onlyOwner](#onlyowner)

### onlyOwner

```js
modifier onlyOwner() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [transferOwnership(address newOwner_)](#transferownership)
- [acceptOwnership()](#acceptownership)
- [setLiquidator(address _liquidator)](#setliquidator)
- [getUtilizationRate(uint256 cash, uint256 borrows)](#getutilizationrate)
- [getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows)](#getutilizationandannualborrowrate)
- [getSupplyRate(address _asset, uint256 cash, uint256 borrows)](#getsupplyrate)
- [getBorrowRate(address asset, uint256 cash, uint256 borrows)](#getborrowrate)

### transferOwnership

```js
function transferOwnership(address newOwner_) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newOwner_ | address |  | 

### acceptOwnership

```js
function acceptOwnership() external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### setLiquidator

```js
function setLiquidator(address _liquidator) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _liquidator | address |  | 

### getUtilizationRate

```js
function getUtilizationRate(uint256 cash, uint256 borrows) internal pure
returns(enum AlkemiRateModel.IRError, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cash | uint256 |  | 
| borrows | uint256 |  | 

### getUtilizationAndAnnualBorrowRate

```js
function getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows) internal view
returns(enum AlkemiRateModel.IRError, struct Exponential.Exp, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cash | uint256 |  | 
| borrows | uint256 |  | 

### getSupplyRate

Gets the current supply interest rate based on the given asset, total cash and total borrows

```js
function getSupplyRate(address _asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the supply interest rate per block scaled by 10e18

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _asset | address | The asset to get the interest rate of | 
| cash | uint256 | The total cash of the asset in the market | 
| borrows | uint256 | The total borrows of the asset in the market | 

### getBorrowRate

Gets the current borrow interest rate based on the given asset, total cash and total borrows

```js
function getBorrowRate(address asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the borrow interest rate per block scaled by 10e18

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | The asset to get the interest rate of | 
| cash | uint256 | The total cash of the asset in the market | 
| borrows | uint256 | The total borrows of the asset in the market | 

## Contracts

* [AggregatorV3Interface](AggregatorV3Interface.md)
* [AlkemiRateModel](AlkemiRateModel.md)
* [AlkemiWETH](AlkemiWETH.md)
* [CarefulMath](CarefulMath.md)
* [ChainLink](ChainLink.md)
* [EIP20Interface](EIP20Interface.md)
* [EIP20NonStandardInterface](EIP20NonStandardInterface.md)
* [ErrorReporter](ErrorReporter.md)
* [ExchangeRateModel](ExchangeRateModel.md)
* [Exponential](Exponential.md)
* [InterestRateModel](InterestRateModel.md)
* [JumpRateModel](JumpRateModel.md)
* [JumpRateModelV2](JumpRateModelV2.md)
* [LiquidationChecker](LiquidationChecker.md)
* [Liquidator](Liquidator.md)
* [Migrations](Migrations.md)
* [MoneyMarket](MoneyMarket.md)
* [PriceOracle](PriceOracle.md)
* [PriceOracleInterface](PriceOracleInterface.md)
* [PriceOracleProxy](PriceOracleProxy.md)
* [SafeMath](SafeMath.md)
* [SafeToken](SafeToken.md)
* [StableCoinInterestRateModel](StableCoinInterestRateModel.md)
* [StandardInterestRateModel](StandardInterestRateModel.md)
* [TestTokens](TestTokens.md)
