---
layout: default
title: CarefulMath
---

# Careful Math \(CarefulMath.sol\)

View Source: [contracts/CarefulMath.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/CarefulMath.sol)

**↗ Extends:** [**ErrorReporter**](../contracts/errorreporter.md) **↘ Derived Contracts:** [**Exponential**](exponential.md)

Derived from OpenZeppelin's SafeMath library [https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol)

## Functions

* [mul\(uint256 a, uint256 b\)](carefulmath.md#mul)
* [div\(uint256 a, uint256 b\)](carefulmath.md#div)
* [sub\(uint256 a, uint256 b\)](carefulmath.md#sub)
* [subInt\(uint256 a, uint256 b\)](carefulmath.md#subint)
* [add\(uint256 a, uint256 b\)](carefulmath.md#add)
* [addInt\(uint256 a, int256 b\)](carefulmath.md#addint)
* [addThenSub\(uint256 a, uint256 b, uint256 c\)](carefulmath.md#addthensub)

### mul

Multiplies two numbers, returns an error on overflow.

```javascript
function mul(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### div

Integer division of two numbers, truncating the quotient.

```javascript
function div(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### sub

Subtracts two numbers, returns an error on overflow \(i.e. if subtrahend is greater than minuend\).

```javascript
function sub(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### subInt

Subtracts two numbers, returns an error on overflow \(i.e. if subtrahend is greater than minuend\).

```javascript
function subInt(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, int256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### add

Adds two numbers, returns an error on overflow.

```javascript
function add(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### addInt

Adds two numbers, returns an error on overflow.

```javascript
function addInt(uint256 a, int256 b) internal pure
returns(enum ErrorReporter.Error, int256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | int256 |  |

### addThenSub

add a and b and then subtract c

```javascript
function addThenSub(uint256 a, uint256 b, uint256 c) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |
| c | uint256 |  |

