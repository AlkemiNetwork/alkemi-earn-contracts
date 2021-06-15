# Exponential module for storing fixed-precision decimals (ExponentialNoError.sol)

View Source: [contracts/ExponentialNoError.sol](../contracts/ExponentialNoError.sol)

**↘ Derived Contracts: [RewardControl](RewardControl.md)**

**ExponentialNoError**

Exp is a struct which stores decimals with a fixed precision of 18 decimal places.
        Thus, if we wanted to store the 5.1, mantissa would store 5.1e18. That is:
        `Exp({mantissa: 5100000000000000000})`.

## Structs
### Exp

```js
struct Exp {
 uint256 mantissa
}
```

### Double

```js
struct Double {
 uint256 mantissa
}
```

## Contract Members
**Constants & Variables**

```js
uint256 internal constant expScale;
uint256 internal constant doubleScale;
uint256 internal constant halfExpScale;
uint256 internal constant mantissaOne;

```

## Functions

- [truncate(struct ExponentialNoError.Exp exp)](#truncate)
- [mul_ScalarTruncate(struct ExponentialNoError.Exp a, uint256 scalar)](#mul_scalartruncate)
- [mul_ScalarTruncateAddUInt(struct ExponentialNoError.Exp a, uint256 scalar, uint256 addend)](#mul_scalartruncateadduint)
- [lessThanExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right)](#lessthanexp)
- [lessThanOrEqualExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right)](#lessthanorequalexp)
- [greaterThanExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right)](#greaterthanexp)
- [isZeroExp(struct ExponentialNoError.Exp value)](#iszeroexp)
- [safe224(uint256 n, string errorMessage)](#safe224)
- [safe32(uint256 n, string errorMessage)](#safe32)
- [add_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b)](#add_)
- [add_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b)](#add_)
- [add_(uint256 a, uint256 b)](#add_)
- [add_(uint256 a, uint256 b, string errorMessage)](#add_)
- [sub_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b)](#sub_)
- [sub_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b)](#sub_)
- [sub_(uint256 a, uint256 b)](#sub_)
- [sub_(uint256 a, uint256 b, string errorMessage)](#sub_)
- [mul_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b)](#mul_)
- [mul_(struct ExponentialNoError.Exp a, uint256 b)](#mul_)
- [mul_(uint256 a, struct ExponentialNoError.Exp b)](#mul_)
- [mul_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b)](#mul_)
- [mul_(struct ExponentialNoError.Double a, uint256 b)](#mul_)
- [mul_(uint256 a, struct ExponentialNoError.Double b)](#mul_)
- [mul_(uint256 a, uint256 b)](#mul_)
- [mul_(uint256 a, uint256 b, string errorMessage)](#mul_)
- [div_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b)](#div_)
- [div_(struct ExponentialNoError.Exp a, uint256 b)](#div_)
- [div_(uint256 a, struct ExponentialNoError.Exp b)](#div_)
- [div_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b)](#div_)
- [div_(struct ExponentialNoError.Double a, uint256 b)](#div_)
- [div_(uint256 a, struct ExponentialNoError.Double b)](#div_)
- [div_(uint256 a, uint256 b)](#div_)
- [div_(uint256 a, uint256 b, string errorMessage)](#div_)
- [fraction(uint256 a, uint256 b)](#fraction)

### truncate

Truncates the given exp to a whole number value.
     For example, truncate(Exp{mantissa: 15 * expScale}) = 15

```js
function truncate(struct ExponentialNoError.Exp exp) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| exp | struct ExponentialNoError.Exp |  | 

### mul_ScalarTruncate

Multiply an Exp by a scalar, then truncate to return an unsigned integer.

```js
function mul_ScalarTruncate(struct ExponentialNoError.Exp a, uint256 scalar) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Exp |  | 
| scalar | uint256 |  | 

### mul_ScalarTruncateAddUInt

Multiply an Exp by a scalar, truncate, then add an to an unsigned integer, returning an unsigned integer.

```js
function mul_ScalarTruncateAddUInt(struct ExponentialNoError.Exp a, uint256 scalar, uint256 addend) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Exp |  | 
| scalar | uint256 |  | 
| addend | uint256 |  | 

### lessThanExp

Checks if first Exp is less than second Exp.

```js
function lessThanExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| left | struct ExponentialNoError.Exp |  | 
| right | struct ExponentialNoError.Exp |  | 

### lessThanOrEqualExp

Checks if left Exp <= right Exp.

```js
function lessThanOrEqualExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| left | struct ExponentialNoError.Exp |  | 
| right | struct ExponentialNoError.Exp |  | 

### greaterThanExp

Checks if left Exp > right Exp.

```js
function greaterThanExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| left | struct ExponentialNoError.Exp |  | 
| right | struct ExponentialNoError.Exp |  | 

### isZeroExp

returns true if Exp is exactly zero

```js
function isZeroExp(struct ExponentialNoError.Exp value) internal pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | struct ExponentialNoError.Exp |  | 

### safe224

```js
function safe224(uint256 n, string errorMessage) internal pure
returns(uint224)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| n | uint256 |  | 
| errorMessage | string |  | 

### safe32

```js
function safe32(uint256 n, string errorMessage) internal pure
returns(uint32)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| n | uint256 |  | 
| errorMessage | string |  | 

### add_

```js
function add_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Exp |  | 
| b | struct ExponentialNoError.Exp |  | 

### add_

```js
function add_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Double |  | 
| b | struct ExponentialNoError.Double |  | 

### add_

```js
function add_(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### add_

```js
function add_(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 
| errorMessage | string |  | 

### sub_

```js
function sub_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Exp |  | 
| b | struct ExponentialNoError.Exp |  | 

### sub_

```js
function sub_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Double |  | 
| b | struct ExponentialNoError.Double |  | 

### sub_

```js
function sub_(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### sub_

```js
function sub_(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 
| errorMessage | string |  | 

### mul_

```js
function mul_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Exp |  | 
| b | struct ExponentialNoError.Exp |  | 

### mul_

```js
function mul_(struct ExponentialNoError.Exp a, uint256 b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Exp |  | 
| b | uint256 |  | 

### mul_

```js
function mul_(uint256 a, struct ExponentialNoError.Exp b) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | struct ExponentialNoError.Exp |  | 

### mul_

```js
function mul_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Double |  | 
| b | struct ExponentialNoError.Double |  | 

### mul_

```js
function mul_(struct ExponentialNoError.Double a, uint256 b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Double |  | 
| b | uint256 |  | 

### mul_

```js
function mul_(uint256 a, struct ExponentialNoError.Double b) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | struct ExponentialNoError.Double |  | 

### mul_

```js
function mul_(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### mul_

```js
function mul_(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 
| errorMessage | string |  | 

### div_

```js
function div_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Exp |  | 
| b | struct ExponentialNoError.Exp |  | 

### div_

```js
function div_(struct ExponentialNoError.Exp a, uint256 b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Exp |  | 
| b | uint256 |  | 

### div_

```js
function div_(uint256 a, struct ExponentialNoError.Exp b) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | struct ExponentialNoError.Exp |  | 

### div_

```js
function div_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Double |  | 
| b | struct ExponentialNoError.Double |  | 

### div_

```js
function div_(struct ExponentialNoError.Double a, uint256 b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct ExponentialNoError.Double |  | 
| b | uint256 |  | 

### div_

```js
function div_(uint256 a, struct ExponentialNoError.Double b) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | struct ExponentialNoError.Double |  | 

### div_

```js
function div_(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### div_

```js
function div_(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 
| errorMessage | string |  | 

### fraction

```js
function fraction(uint256 a, uint256 b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

## Contracts

* [AggregatorV3Interface](AggregatorV3Interface.md)
* [AlkemiEarnPublicV10](AlkemiEarnPublicV10.md)
* [AlkemiRateModel](AlkemiRateModel.md)
* [AlkemiWETH](AlkemiWETH.md)
* [CarefulMath](CarefulMath.md)
* [ChainLink](ChainLink.md)
* [EIP20Interface](EIP20Interface.md)
* [EIP20NonStandardInterface](EIP20NonStandardInterface.md)
* [ErrorReporter](ErrorReporter.md)
* [ExchangeRateModel](ExchangeRateModel.md)
* [Exponential](Exponential.md)
* [ExponentialNoError](ExponentialNoError.md)
* [InterestRateModel](InterestRateModel.md)
* [JumpRateModel](JumpRateModel.md)
* [JumpRateModelV2](JumpRateModelV2.md)
* [LiquidationChecker](LiquidationChecker.md)
* [Liquidator](Liquidator.md)
* [Migrations](Migrations.md)
* [MoneyMarket](MoneyMarket.md)
* [MoneyMarketV11](MoneyMarketV11.md)
* [MoneyMarketV12](MoneyMarketV12.md)
* [PriceOracle](PriceOracle.md)
* [PriceOracleInterface](PriceOracleInterface.md)
* [PriceOracleProxy](PriceOracleProxy.md)
* [RewardControl](RewardControl.md)
* [RewardControlInterface](RewardControlInterface.md)
* [RewardControlStorage](RewardControlStorage.md)
* [SafeMath](SafeMath.md)
* [SafeToken](SafeToken.md)
* [StableCoinInterestRateModel](StableCoinInterestRateModel.md)
* [StandardInterestRateModel](StandardInterestRateModel.md)
* [TestTokens](TestTokens.md)
