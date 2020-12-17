# AggregatorV3Interface.sol

View Source: [node_modules/@chainlink/contracts/src/v0.4/interfaces/AggregatorV3Interface.sol](../node_modules/@chainlink/contracts/src/v0.4/interfaces/AggregatorV3Interface.sol)

**AggregatorV3Interface**

## Functions

- [decimals()](#decimals)
- [description()](#description)
- [version()](#version)
- [getRoundData(uint80 _roundId)](#getrounddata)
- [latestRoundData()](#latestrounddata)

### decimals

```js
function decimals() external view
returns(uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### description

```js
function description() external view
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### version

```js
function version() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getRoundData

```js
function getRoundData(uint80 _roundId) external view
returns(roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _roundId | uint80 |  | 

### latestRoundData

```js
function latestRoundData() external view
returns(roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

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
