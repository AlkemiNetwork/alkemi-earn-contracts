---
layout: default
title: CarefulMath
---

# Careful Math (CarefulMath.sol)

View Source: [contracts/CarefulMath.sol](../contracts/CarefulMath.sol)

**↗ Extends: [ErrorReporter](ErrorReporter.md)**
**↘ Derived Contracts: [Exponential](Exponential.md)**

**{{ContractName}}**

Derived from OpenZeppelin's SafeMath library
        https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol

## Functions

- [mul(uint256 a, uint256 b)](#mul)
- [div(uint256 a, uint256 b)](#div)
- [sub(uint256 a, uint256 b)](#sub)
- [subInt(uint256 a, uint256 b)](#subint)
- [add(uint256 a, uint256 b)](#add)
- [addInt(uint256 a, int256 b)](#addint)
- [addThenSub(uint256 a, uint256 b, uint256 c)](#addthensub)

### mul

Multiplies two numbers, returns an error on overflow.

```js
function mul(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### div

Integer division of two numbers, truncating the quotient.

```js
function div(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### sub

Subtracts two numbers, returns an error on overflow (i.e. if subtrahend is greater than minuend).

```js
function sub(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### subInt

Subtracts two numbers, returns an error on overflow (i.e. if subtrahend is greater than minuend).

```js
function subInt(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, int256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### add

Adds two numbers, returns an error on overflow.

```js
function add(uint256 a, uint256 b) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 

### addInt

Adds two numbers, returns an error on overflow.

```js
function addInt(uint256 a, int256 b) internal pure
returns(enum ErrorReporter.Error, int256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | int256 |  | 

### addThenSub

add a and b and then subtract c

```js
function addThenSub(uint256 a, uint256 b, uint256 c) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| a | uint256 |  | 
| b | uint256 |  | 
| c | uint256 |  | 

