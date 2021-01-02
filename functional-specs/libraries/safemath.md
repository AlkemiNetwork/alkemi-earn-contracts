---
layout: default
title: SafeMath
---

# SafeMath.sol

View Source: [contracts/SafeMath.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/SafeMath.sol)

Wrappers over Solidity's arithmetic operations with added overflow checks.

* Arithmetic operations in Solidity wrap on overflow. This can easily result

  in bugs, because programmers usually assume that an overflow raises an

  error, which is the standard behavior in high level programming languages.

  `SafeMath` restores this intuition by reverting the transaction when an

  operation overflows.

* Using this library instead of the unchecked operations eliminates an entire

  class of bugs, so it's recommended to use it always.

## Functions

* [add\(uint256 a, uint256 b\)](safemath.md#add)
* [add\(uint256 a, uint256 b, string errorMessage\)](safemath.md#add)
* [sub\(uint256 a, uint256 b\)](safemath.md#sub)
* [sub\(uint256 a, uint256 b, string errorMessage\)](safemath.md#sub)
* [mul\(uint256 a, uint256 b\)](safemath.md#mul)
* [mul\(uint256 a, uint256 b, string errorMessage\)](safemath.md#mul)
* [div\(uint256 a, uint256 b\)](safemath.md#div)
* [div\(uint256 a, uint256 b, string errorMessage\)](safemath.md#div)
* [mod\(uint256 a, uint256 b\)](safemath.md#mod)
* [mod\(uint256 a, uint256 b, string errorMessage\)](safemath.md#mod)

### add

Returns the addition of two unsigned integers, reverting on overflow.

* Counterpart to Solidity's `+` operator.
* Requirements:
  * Addition cannot overflow.

```javascript
function add(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### add

Returns the addition of two unsigned integers, reverting with custom message on overflow.

* Counterpart to Solidity's `+` operator.
* Requirements:
  * Addition cannot overflow.

```javascript
function add(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

### sub

Returns the subtraction of two unsigned integers, reverting on underflow \(when the result is negative\).

* Counterpart to Solidity's `-` operator.
* Requirements:
  * Subtraction cannot underflow.

```javascript
function sub(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### sub

Returns the subtraction of two unsigned integers, reverting with custom message on underflow \(when the result is negative\).

* Counterpart to Solidity's `-` operator.
* Requirements:
  * Subtraction cannot underflow.

```javascript
function sub(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

### mul

Returns the multiplication of two unsigned integers, reverting on overflow.

* Counterpart to Solidity's `*` operator.
* Requirements:
  * Multiplication cannot overflow.

```javascript
function mul(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### mul

Returns the multiplication of two unsigned integers, reverting on overflow.

* Counterpart to Solidity's `*` operator.
* Requirements:
  * Multiplication cannot overflow.

```javascript
function mul(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

### div

Returns the integer division of two unsigned integers. Reverts on division by zero. The result is rounded towards zero.

* Counterpart to Solidity's `/` operator. Note: this function uses a

  `revert` opcode \(which leaves remaining gas untouched\) while Solidity

  uses an invalid opcode to revert \(consuming all remaining gas\).

* Requirements:
  * The divisor cannot be zero.

```javascript
function div(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### div

Returns the integer division of two unsigned integers. Reverts with custom message on division by zero. The result is rounded towards zero.

* Counterpart to Solidity's `/` operator. Note: this function uses a

  `revert` opcode \(which leaves remaining gas untouched\) while Solidity

  uses an invalid opcode to revert \(consuming all remaining gas\).

* Requirements:
  * The divisor cannot be zero.

```javascript
function div(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

### mod

Returns the remainder of dividing two unsigned integers. \(unsigned integer modulo\), Reverts when dividing by zero.

* Counterpart to Solidity's `%` operator. This function uses a `revert`

  opcode \(which leaves remaining gas untouched\) while Solidity uses an

  invalid opcode to revert \(consuming all remaining gas\).

* Requirements:
  * The divisor cannot be zero.

```javascript
function mod(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### mod

Returns the remainder of dividing two unsigned integers. \(unsigned integer modulo\), Reverts with custom message when dividing by zero.

* Counterpart to Solidity's `%` operator. This function uses a `revert`

  opcode \(which leaves remaining gas untouched\) while Solidity uses an

  invalid opcode to revert \(consuming all remaining gas\).

* Requirements:
  * The divisor cannot be zero.

```javascript
function mod(uint256 a, uint256 b, string errorMessage) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| errorMessage | string |  |

