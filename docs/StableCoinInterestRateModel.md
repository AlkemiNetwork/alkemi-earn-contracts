# The Compound Stable Coin Interest Rate Model (StableCoinInterestRateModel.sol)

View Source: [contracts/StableCoinInterestRateModel.sol](../contracts/StableCoinInterestRateModel.sol)

**↗ Extends: [Exponential](Exponential.md)**

**StableCoinInterestRateModel**

See Section 2.4 of the Compound Whitepaper

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
uint256 internal constant oneMinusSpreadBasisPoints;
uint256 internal constant blocksPerYear;

```

## Functions

- [getUtilizationRate(uint256 cash, uint256 borrows)](#getutilizationrate)
- [getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows)](#getutilizationandannualborrowrate)
- [getSupplyRate(address _asset, uint256 cash, uint256 borrows)](#getsupplyrate)
- [getBorrowRate(address _asset, uint256 cash, uint256 borrows)](#getborrowrate)

### getUtilizationRate

```js
function getUtilizationRate(uint256 cash, uint256 borrows) internal pure
returns(enum StableCoinInterestRateModel.IRError, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| cash | uint256 |  | 
| borrows | uint256 |  | 

### getUtilizationAndAnnualBorrowRate

```js
function getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows) internal pure
returns(enum StableCoinInterestRateModel.IRError, struct Exponential.Exp, struct Exponential.Exp)
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
function getBorrowRate(address _asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the borrow interest rate per block scaled by 10e18

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _asset | address | The asset to get the interest rate of | 
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
