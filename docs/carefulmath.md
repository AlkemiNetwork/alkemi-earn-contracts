---
layout: default
title: CarefulMath
---

# Careful Math \(CarefulMath.sol\)

View Source: [contracts/CarefulMath.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/CarefulMath.sol)

**↗ Extends:** [**ErrorReporter**](errorreporter.md) **↘ Derived Contracts:** [**Exponential**](exponential.md)

Derived from OpenZeppelin's SafeMath library [https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol)

### Functions

* mul\(uint256 a, uint256 b\)
* div\(uint256 a, uint256 b\)
* sub\(uint256 a, uint256 b\)
* add\(uint256 a, uint256 b\)
* addThenSub\(uint256 a, uint256 b, uint256 c\)

#### mul

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

#### div

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

#### sub

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

#### add

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

#### addThenSub

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

