---
layout: default
title: Exponential
---

# Exponential.sol

View Source: [contracts/Exponential.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/ce21ca2977fede7cb2c3063f834b63f560d9d3a8/contracts/Exponential.sol)

**↗ Extends:** [**ErrorReporter**](../contracts/errorreporter.md)**,** [**CarefulMath**](carefulmath.md) **↘ Derived Contracts:** [**AlkemiRateModel**](../contracts/alkemiratemodel.md)**,** [**ExchangeRateModel**](../contracts/exchangeratemodel.md)**,** [**MoneyMarket**](../contracts/moneymarket.md)**,** [**PriceOracle**](../contracts/priceoracle.md)

## Structs

### Exp

```javascript
struct Exp {
 uint256 mantissa
}
```

### ExpNegative

```javascript
struct ExpNegative {
 int256 mantissa
}
```

## Contract Members

**Constants & Variables**

```javascript
uint256 internal constant expScale;
uint256 internal constant halfExpScale;
uint256 internal constant mantissaOne;
uint256 internal constant mantissaOneTenth;
```

## Functions

* [getExp\(uint256 num, uint256 denom\)](exponential.md#getexp)
* [addExp\(struct Exponential.Exp a, struct Exponential.Exp b\)](exponential.md#addexp)
* [addExpNegative\(struct Exponential.Exp a, struct Exponential.ExpNegative b\)](exponential.md#addexpnegative)
* [subExp\(struct Exponential.Exp a, struct Exponential.Exp b\)](exponential.md#subexp)
* [subExpNegative\(struct Exponential.Exp a, struct Exponential.Exp b\)](exponential.md#subexpnegative)
* [mulScalar\(struct Exponential.Exp a, uint256 scalar\)](exponential.md#mulscalar)
* [divScalar\(struct Exponential.Exp a, uint256 scalar\)](exponential.md#divscalar)
* [divScalarByExp\(uint256 scalar, struct Exponential.Exp divisor\)](exponential.md#divscalarbyexp)
* [mulExp\(struct Exponential.Exp a, struct Exponential.Exp b\)](exponential.md#mulexp)
* [divExp\(struct Exponential.Exp a, struct Exponential.Exp b\)](exponential.md#divexp)
* [truncate\(struct Exponential.Exp exp\)](exponential.md#truncate)
* [lessThanExp\(struct Exponential.Exp left, struct Exponential.Exp right\)](exponential.md#lessthanexp)
* [lessThanOrEqualExp\(struct Exponential.Exp left, struct Exponential.Exp right\)](exponential.md#lessthanorequalexp)
* [greaterThanExp\(struct Exponential.Exp left, struct Exponential.Exp right\)](exponential.md#greaterthanexp)
* [isZeroExp\(struct Exponential.Exp value\)](exponential.md#iszeroexp)

### getExp

Creates an exponential from numerator and denominator values. Note: Returns an error if \(`num` \* 10e18\) &gt; MAX\_INT, or if `denom` is zero.

```javascript
function getExp(uint256 num, uint256 denom) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| num | uint256 |  |
| denom | uint256 |  |

### addExp

Adds two exponentials, returning a new exponential.

```javascript
function addExp(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct Exponential.Exp |  |
| b | struct Exponential.Exp |  |

### addExpNegative

Adds two exponentials, returning a new exponential.

```javascript
function addExpNegative(struct Exponential.Exp a, struct Exponential.ExpNegative b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct Exponential.Exp |  |
| b | struct Exponential.ExpNegative |  |

### subExp

Subtracts two exponentials, returning a new exponential.

```javascript
function subExp(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct Exponential.Exp |  |
| b | struct Exponential.Exp |  |

### subExpNegative

Subtracts two exponentials, returning a new exponential.

```javascript
function subExpNegative(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.ExpNegative)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct Exponential.Exp |  |
| b | struct Exponential.Exp |  |

### mulScalar

Multiply an Exp by a scalar, returning a new Exp.

```javascript
function mulScalar(struct Exponential.Exp a, uint256 scalar) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct Exponential.Exp |  |
| scalar | uint256 |  |

### divScalar

Divide an Exp by a scalar, returning a new Exp.

```javascript
function divScalar(struct Exponential.Exp a, uint256 scalar) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct Exponential.Exp |  |
| scalar | uint256 |  |

### divScalarByExp

Divide a scalar by an Exp, returning a new Exp.

```javascript
function divScalarByExp(uint256 scalar, struct Exponential.Exp divisor) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| scalar | uint256 |  |
| divisor | struct Exponential.Exp |  |

### mulExp

Multiplies two exponentials, returning a new exponential.

```javascript
function mulExp(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct Exponential.Exp |  |
| b | struct Exponential.Exp |  |

### divExp

Divides two exponentials, returning a new exponential. \(a/scale\) / \(b/scale\) = \(a/scale\) \* \(scale/b\) = a/b, which we can scale as an Exp by calling getExp\(a.mantissa, b.mantissa\)

```javascript
function divExp(struct Exponential.Exp a, struct Exponential.Exp b) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct Exponential.Exp |  |
| b | struct Exponential.Exp |  |

### truncate

Truncates the given exp to a whole number value. For example, truncate\(Exp{mantissa: 15  _\(10\*_18\)}\) = 15

```javascript
function truncate(struct Exponential.Exp exp) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| exp | struct Exponential.Exp |  |

### lessThanExp

Checks if first Exp is less than second Exp.

```javascript
function lessThanExp(struct Exponential.Exp left, struct Exponential.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| left | struct Exponential.Exp |  |
| right | struct Exponential.Exp |  |

### lessThanOrEqualExp

Checks if left Exp &lt;= right Exp.

```javascript
function lessThanOrEqualExp(struct Exponential.Exp left, struct Exponential.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| left | struct Exponential.Exp |  |
| right | struct Exponential.Exp |  |

### greaterThanExp

Checks if first Exp is greater than second Exp.

```javascript
function greaterThanExp(struct Exponential.Exp left, struct Exponential.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| left | struct Exponential.Exp |  |
| right | struct Exponential.Exp |  |

### isZeroExp

returns true if Exp is exactly zero

```javascript
function isZeroExp(struct Exponential.Exp value) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| value | struct Exponential.Exp |  |

