---
layout: default
title: Exponential
---

# Exponential.sol

View Source: [contracts/Exponential.sol](../contracts/Exponential.sol)

**↗ Extends:** [**ErrorReporter**](ErrorReporter.md)**,** [**CarefulMath**](CarefulMath.md) **↘ Derived Contracts:** [**AlkemiEarnPublic**](AlkemiEarnPublic.md)**,** [**AlkemiEarnVerified**](AlkemiEarnVerified.md)**,** [**AlkemiRateModel**](AlkemiRateModel.md)**,** [**ExchangeRateModel**](ExchangeRateModel.md)**,** [**PriceOracle**](PriceOracle.md)

### Structs

#### Exp

```javascript
struct Exp {
 uint256 mantissa
}
```

### Contract Members

**Constants & Variables**

```javascript
uint256 internal constant expScale;
uint256 internal constant halfExpScale;
uint256 internal constant mantissaOne;
uint256 internal constant mantissaOneTenth;
```

### Functions

* getExp\(uint256 num, uint256 denom\)
* addExp\(struct Exponential.Exp a, struct Exponential.Exp b\)
* subExp\(struct Exponential.Exp a, struct Exponential.Exp b\)
* mulScalar\(struct Exponential.Exp a, uint256 scalar\)
* divScalar\(struct Exponential.Exp a, uint256 scalar\)
* divScalarByExp\(uint256 scalar, struct Exponential.Exp divisor\)
* mulExp\(struct Exponential.Exp a, struct Exponential.Exp b\)
* divExp\(struct Exponential.Exp a, struct Exponential.Exp b\)
* truncate\(struct Exponential.Exp exp\)
* lessThanExp\(struct Exponential.Exp left, struct Exponential.Exp right\)
* lessThanOrEqualExp\(struct Exponential.Exp left, struct Exponential.Exp right\)
* greaterThanExp\(struct Exponential.Exp left, struct Exponential.Exp right\)
* isZeroExp\(struct Exponential.Exp value\)

#### getExp

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

#### addExp

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

#### subExp

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

#### mulScalar

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

#### divScalar

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

#### divScalarByExp

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

#### mulExp

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

#### divExp

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

#### truncate

Truncates the given exp to a whole number value. For example, truncate\(Exp{mantissa: 15  _\(10\*_18\)}\) = 15

```javascript
function truncate(struct Exponential.Exp exp) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| exp | struct Exponential.Exp |  |

#### lessThanExp

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

#### lessThanOrEqualExp

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

#### greaterThanExp

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

#### isZeroExp

returns true if Exp is exactly zero

```javascript
function isZeroExp(struct Exponential.Exp value) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| value | struct Exponential.Exp |  |

