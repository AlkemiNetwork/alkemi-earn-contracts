---
layout: default
title: FaucetNonStandardToken
---

# The Compound Faucet Test Token (FaucetNonStandardToken.sol)

View Source: [contracts/Tokens/FaucetNonStandardToken.sol](../contracts/Tokens/FaucetNonStandardToken.sol)

**↗ Extends: [NonStandardToken](NonStandardToken.md)**

**{{ContractName}}**

A simple test token that lets anyone get more of it.

## Contract Members
**Constants & Variables**

```js
string public name;
string public symbol;
uint8 public decimals;

```

## Functions

- [allocateTo(address _owner, uint256 value)](#allocateto)

### allocateTo

Arbitrarily adds tokens to any account

```js
function allocateTo(address _owner, uint256 value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address |  | 
| value | uint256 |  | 

