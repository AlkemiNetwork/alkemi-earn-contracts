# PriceOracleProxy.sol

View Source: [contracts/PriceOracleProxy.sol](../contracts/PriceOracleProxy.sol)

**PriceOracleProxy**

## Contract Members
**Constants & Variables**

```js
address public mostRecentCaller;
uint256 public mostRecentBlock;
contract PriceOracleInterface public realPriceOracle;

```

## Functions

- [assetPrices(address asset)](#assetprices)

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

## Contracts

* [CarefulMath](CarefulMath.md)
* [EIP20Interface](EIP20Interface.md)
* [EIP20NonStandardInterface](EIP20NonStandardInterface.md)
* [ErrorReporter](ErrorReporter.md)
* [ExchangeRateModel](ExchangeRateModel.md)
* [Exponential](Exponential.md)
* [InterestRateModel](InterestRateModel.md)
* [LiquidationChecker](LiquidationChecker.md)
* [Liquidator](Liquidator.md)
* [Migrations](Migrations.md)
* [MoneyMarket](MoneyMarket.md)
* [PriceOracle](PriceOracle.md)
* [PriceOracleInterface](PriceOracleInterface.md)
* [PriceOracleProxy](PriceOracleProxy.md)
* [SafeToken](SafeToken.md)