# EIP20Interface.sol

View Source: [contracts/LiquidationChecker.sol](../contracts/LiquidationChecker.sol)

**EIP20Interface**

## Contract Members
**Constants & Variables**

```js
address public mostRecentCaller;
uint256 public mostRecentBlock;
address public oracle;
contract MoneyMarket public moneyMarket;
address public liquidator;
bool public allowLiquidation;

```

## Functions

- [balanceOf(address _owner)](#balanceof)
- [assetPrices(address asset)](#assetprices)
- [isAllowed(address asset, uint256 newCash)](#isallowed)
- [isLiquidate(address asset, uint256 newCash)](#isliquidate)
- [cashIsUp(address asset, uint256 newCash)](#cashisup)
- [oracleTouched()](#oracletouched)
- [setAllowLiquidation(bool allowLiquidation_)](#setallowliquidation)

### balanceOf

```js
function balanceOf(address _owner) public view
returns(balance uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address |  | 

### assetPrices

Gets the price of a given asset

```js
function assetPrices(address asset) public nonpayable
returns(uint256)
```

**Returns**

the price scaled by 10**18, or zero if the price is not available

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | Asset to get the price of | 

### isAllowed

```js
function isAllowed(address asset, uint256 newCash) internal nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| newCash | uint256 |  | 

### isLiquidate

```js
function isLiquidate(address asset, uint256 newCash) internal nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| newCash | uint256 |  | 

### cashIsUp

```js
function cashIsUp(address asset, uint256 newCash) internal view
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| newCash | uint256 |  | 

### oracleTouched

```js
function oracleTouched() internal nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### setAllowLiquidation

```js
function setAllowLiquidation(bool allowLiquidation_) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| allowLiquidation_ | bool |  | 

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
