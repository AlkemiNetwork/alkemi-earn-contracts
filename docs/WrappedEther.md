---
layout: default
title: WrappedEther
---

# The Compound Wrapped Ether Test Token (WrappedEther.sol)

View Source: [contracts/Tokens/WrappedEther.sol](../contracts/Tokens/WrappedEther.sol)

**↗ Extends: [StandardToken](StandardToken.md)**

**{{ContractName}}**

A simple test token to wrap ether

## Contract Members
**Constants & Variables**

```js
string public name;
string public symbol;
uint8 public decimals;

```

## Functions

- [deposit()](#deposit)
- [withdraw(uint256 amount)](#withdraw)

### deposit

Send ether to get tokens

```js
function deposit() public payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### withdraw

Withdraw tokens as ether

```js
function withdraw(uint256 amount) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| amount | uint256 |  | 

