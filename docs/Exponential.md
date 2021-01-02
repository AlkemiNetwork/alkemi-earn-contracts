---
layout: default
title: Exponential
---

# Exponential.sol

View Source: [contracts/Exponential.sol](../contracts/Exponential.sol)

**↗ Extends: [ErrorReporter](ErrorReporter.md), [CarefulMath](CarefulMath.md)**
**↘ Derived Contracts: [AlkemiRateModel](AlkemiRateModel.md), [ExchangeRateModel](ExchangeRateModel.md), [MoneyMarket](MoneyMarket.md), [PriceOracle](PriceOracle.md)**

**{{ContractName}}**

## Structs
### Exp

```js
struct Exp {
 uint256 mantissa
}
```

### ExpNegative

```js
struct ExpNegative {
 int256 mantissa
}
```

## Contract Members
**Constants & Variables**

```js
uint256 internal constant expScale;
uint256 internal constant halfExpScale;
uint256 internal constant mantissaOne;
uint256 internal constant mantissaOneTenth;

```

## Functions

- [getExp(uint256 num, uint256 denom)](#getexp)
- [addExp(struct Exponential.Exp a, struct Exponential.Exp b)](#addexp)
- [addExpNegative(struct Exponential.Exp a, struct Exponential.ExpNegative b)](#addexpnegative)
- [subExp(struct Exponential.Exp a, struct Exponential.Exp b)](#subexp)
- [subExpNegative(struct Exponential.Exp a, struct Exponential.Exp b)](#subexpnegative)
- [mulScalar(struct Exponential.Exp a, uint256 scalar)](#mulscalar)
- [divScalar(struct Exponential.Exp a, uint256 scalar)](#divscalar)
- [divScalarByExp(uint256 scalar, struct Exponential.Exp divisor)](#divscalarbyexp)
- [mulExp(struct Exponential.Exp a, struct Exponential.Exp b)](#mulexp)
- [divExp(struct Exponential.Exp a, struct Exponential.Exp b)](#divexp)
- [truncate(struct Exponential.Exp exp)](#truncate)
- [lessThanExp(struct Exponential.Exp left, struct Exponential.Exp right)](#lessthanexp)
- [lessThanOrEqualExp(struct Exponential.Exp left, struct Exponential.Exp right)](#lessthanorequalexp)
- [greaterThanExp(struct Exponential.Exp left, struct Exponential.Exp right)](#greaterthanexp)
- [isZeroExp(struct Exponential.Exp value)](#iszeroexp)

### getExp

Creates an exponential from numerator and denominator values.
     Note: Returns an error if (`num` * 10e18) > MAX_INT,
           or if `denom` is zero.

```js
function getExp(uint256 num, uint256 denom) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| num | uint256 |  | 
| denom | uint256 |  | 

### addExp

Adds two exponentials, returning a new exponential.

```js
function addExp(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct Exponential.Exp |  | 
| b | struct Exponential.Exp |  | 

### addExpNegative

Adds two exponentials, returning a new exponential.

```js
function addExpNegative(struct Exponential.Exp a, struct Exponential.ExpNegative b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct Exponential.Exp |  | 
| b | struct Exponential.ExpNegative |  | 

### subExp

Subtracts two exponentials, returning a new exponential.

```js
function subExp(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct Exponential.Exp |  | 
| b | struct Exponential.Exp |  | 

### subExpNegative

Subtracts two exponentials, returning a new exponential.

```js
function subExpNegative(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.ExpNegative)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct Exponential.Exp |  | 
| b | struct Exponential.Exp |  | 

### mulScalar

Multiply an Exp by a scalar, returning a new Exp.

```js
function mulScalar(struct Exponential.Exp a, uint256 scalar) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct Exponential.Exp |  | 
| scalar | uint256 |  | 

### divScalar

Divide an Exp by a scalar, returning a new Exp.

```js
function divScalar(struct Exponential.Exp a, uint256 scalar) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct Exponential.Exp |  | 
| scalar | uint256 |  | 

### divScalarByExp

Divide a scalar by an Exp, returning a new Exp.

```js
function divScalarByExp(uint256 scalar, struct Exponential.Exp divisor) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| scalar | uint256 |  | 
| divisor | struct Exponential.Exp |  | 

### mulExp

Multiplies two exponentials, returning a new exponential.

```js
function mulExp(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct Exponential.Exp |  | 
| b | struct Exponential.Exp |  | 

### divExp

Divides two exponentials, returning a new exponential.
    (a/scale) / (b/scale) = (a/scale) * (scale/b) = a/b,
 which we can scale as an Exp by calling getExp(a.mantissa, b.mantissa)

```js
function divExp(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | struct Exponential.Exp |  | 
| b | struct Exponential.Exp |  | 

### truncate

Truncates the given exp to a whole number value.
     For example, truncate(Exp{mantissa: 15 * (10**18)}) = 15

```js
function truncate(struct Exponential.Exp exp) internal pure
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| exp | struct Exponential.Exp |  | 

### lessThanExp

Checks if first Exp is less than second Exp.

```js
function lessThanExp(struct Exponential.Exp left, struct Exponential.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| left | struct Exponential.Exp |  | 
| right | struct Exponential.Exp |  | 

### lessThanOrEqualExp

Checks if left Exp <= right Exp.

```js
function lessThanOrEqualExp(struct Exponential.Exp left, struct Exponential.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| left | struct Exponential.Exp |  | 
| right | struct Exponential.Exp |  | 

### greaterThanExp

Checks if first Exp is greater than second Exp.

```js
function greaterThanExp(struct Exponential.Exp left, struct Exponential.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| left | struct Exponential.Exp |  | 
| right | struct Exponential.Exp |  | 

### isZeroExp

returns true if Exp is exactly zero

```js
function isZeroExp(struct Exponential.Exp value) internal pure
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| value | struct Exponential.Exp |  | 

