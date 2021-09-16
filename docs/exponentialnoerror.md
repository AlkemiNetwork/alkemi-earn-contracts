---
layout: default
title: ExponentialNoError
---

# Exponential module for storing fixed-precision decimals \(ExponentialNoError.sol\)

View Source: [contracts/ExponentialNoError.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/ExponentialNoError.sol)

**↘ Derived Contracts:** [**RewardControl**](rewardcontrol.md)

Exp is a struct which stores decimals with a fixed precision of 18 decimal places. Thus, if we wanted to store the 5.1, mantissa would store 5.1e18. That is: `Exp({mantissa: 5100000000000000000})`.



### Structs

#### Exp

```javascript
struct Exp {
 uint256 mantissa
}
```

#### Double

```javascript
struct Double {
 uint256 mantissa
}
```

### Contract Members

**Constants & Variables**

```javascript
uint256 internal constant expScale;
uint256 internal constant doubleScale;
uint256 internal constant halfExpScale;
uint256 internal constant mantissaOne;
```

### Functions

* truncate\(struct ExponentialNoError.Exp exp\)
* mul\_ScalarTruncate\(struct ExponentialNoError.Exp a, uint256 scalar\)
* mul\_ScalarTruncateAddUInt\(struct ExponentialNoError.Exp a, uint256 scalar, uint256 addend\)
* lessThanExp\(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right\)
* lessThanOrEqualExp\(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right\)
* greaterThanExp\(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right\)
* isZeroExp\(struct ExponentialNoError.Exp value\)
* safe224\(uint256 n, string errorMessage\)
* safe32\(uint256 n, string errorMessage\)
* add\_\(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b\)
* add\_\(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b\)
* add\_\(uint256 a, uint256 b\)
* add\_\(uint256 a, uint256 b, string errorMessage\)
* sub\_\(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b\)
* sub\_\(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b\)
* sub\_\(uint256 a, uint256 b\)
* sub\_\(uint256 a, uint256 b, string errorMessage\)
* mul\_\(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b\)
* mul\_\(struct ExponentialNoError.Exp a, uint256 b\)
* mul\_\(uint256 a, struct ExponentialNoError.Exp b\)
* mul\_\(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b\)
* mul\_\(struct ExponentialNoError.Double a, uint256 b\)
* mul\_\(uint256 a, struct ExponentialNoError.Double b\)
* mul\_\(uint256 a, uint256 b\)
* mul\_\(uint256 a, uint256 b, string errorMessage\)
* div\_\(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b\)
* div\_\(struct ExponentialNoError.Exp a, uint256 b\)
* div\_\(uint256 a, struct ExponentialNoError.Exp b\)
* div\_\(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b\)
* div\_\(struct ExponentialNoError.Double a, uint256 b\)
* div\_\(uint256 a, struct ExponentialNoError.Double b\)
* div\_\(uint256 a, uint256 b\)
* div\_\(uint256 a, uint256 b, string errorMessage\)
* fraction\(uint256 a, uint256 b\)

#### truncate

Truncates the given exp to a whole number value. For example, truncate\(Exp{mantissa: 15 \* expScale}\) = 15

```javascript
function truncate(struct ExponentialNoError.Exp exp) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| exp | struct ExponentialNoError.Exp |  |

#### mul\_ScalarTruncate

Multiply an Exp by a scalar, then truncate to return an unsigned integer.

```javascript
function mul_ScalarTruncate(struct ExponentialNoError.Exp a, uint256 scalar) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Exp |  |
| scalar | uint256 |  |

#### mul\_ScalarTruncateAddUInt

Multiply an Exp by a scalar, truncate, then add an to an unsigned integer, returning an unsigned integer.

```javascript
function mul_ScalarTruncateAddUInt(struct ExponentialNoError.Exp a, uint256 scalar, uint256 addend) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Exp |  |
| scalar | uint256 |  |
| addend | uint256 |  |

#### lessThanExp

Checks if first Exp is less than second Exp.

```javascript
function lessThanExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| left | struct ExponentialNoError.Exp |  |
| right | struct ExponentialNoError.Exp |  |

#### lessThanOrEqualExp

Checks if left Exp &lt;= right Exp.

```javascript
function lessThanOrEqualExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| left | struct ExponentialNoError.Exp |  |
| right | struct ExponentialNoError.Exp |  |

#### greaterThanExp

Checks if left Exp &gt; right Exp.

```javascript
function greaterThanExp(struct ExponentialNoError.Exp left, struct ExponentialNoError.Exp right) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| left | struct ExponentialNoError.Exp |  |
| right | struct ExponentialNoError.Exp |  |

#### isZeroExp

returns true if Exp is exactly zero

```javascript
function isZeroExp(struct ExponentialNoError.Exp value) internal pure
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| value | struct ExponentialNoError.Exp |  |

#### safe224

```javascript
function safe224(uint256 n, string errorMessage) internal pure
returns(uint224)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| n | uint256 |  |
| errorMessage | string |  |

#### safe32

```javascript
function safe32(uint256 n, string errorMessage) internal pure
returns(uint32)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| n | uint256 |  |
| errorMessage | string |  |

#### add\_

```javascript
function add_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Exp |  |
| b | struct ExponentialNoError.Exp |  |

#### add\_

```javascript
function add_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Double |  |
| b | struct ExponentialNoError.Double |  |

#### add\_

```javascript
function add_(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

#### add\_

```javascript
function add_(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

#### sub\_

```javascript
function sub_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Exp |  |
| b | struct ExponentialNoError.Exp |  |

#### sub\_

```javascript
function sub_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Double |  |
| b | struct ExponentialNoError.Double |  |

#### sub\_

```javascript
function sub_(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

#### sub\_

```javascript
function sub_(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

#### mul\_

```javascript
function mul_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Exp |  |
| b | struct ExponentialNoError.Exp |  |

#### mul\_

```javascript
function mul_(struct ExponentialNoError.Exp a, uint256 b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Exp |  |
| b | uint256 |  |

#### mul\_

```javascript
function mul_(uint256 a, struct ExponentialNoError.Exp b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | struct ExponentialNoError.Exp |  |

#### mul\_

```javascript
function mul_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Double |  |
| b | struct ExponentialNoError.Double |  |

#### mul\_

```javascript
function mul_(struct ExponentialNoError.Double a, uint256 b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Double |  |
| b | uint256 |  |

#### mul\_

```javascript
function mul_(uint256 a, struct ExponentialNoError.Double b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | struct ExponentialNoError.Double |  |

#### mul\_

```javascript
function mul_(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

#### mul\_

```javascript
function mul_(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

#### div\_

```javascript
function div_(struct ExponentialNoError.Exp a, struct ExponentialNoError.Exp b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Exp |  |
| b | struct ExponentialNoError.Exp |  |

#### div\_

```javascript
function div_(struct ExponentialNoError.Exp a, uint256 b) internal pure
returns(struct ExponentialNoError.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Exp |  |
| b | uint256 |  |

#### div\_

```javascript
function div_(uint256 a, struct ExponentialNoError.Exp b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | struct ExponentialNoError.Exp |  |

#### div\_

```javascript
function div_(struct ExponentialNoError.Double a, struct ExponentialNoError.Double b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Double |  |
| b | struct ExponentialNoError.Double |  |

#### div\_

```javascript
function div_(struct ExponentialNoError.Double a, uint256 b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | struct ExponentialNoError.Double |  |
| b | uint256 |  |

#### div\_

```javascript
function div_(uint256 a, struct ExponentialNoError.Double b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | struct ExponentialNoError.Double |  |

#### div\_

```javascript
function div_(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

#### div\_

```javascript
function div_(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

#### fraction

```javascript
function fraction(uint256 a, uint256 b) internal pure
returns(struct ExponentialNoError.Double)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

