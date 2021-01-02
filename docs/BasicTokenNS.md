---
layout: default
title: BasicTokenNS
---

# Basic token (Non-Standard) (BasicTokenNS.sol)

View Source: [contracts/Tokens/BasicTokenNS.sol](../contracts/Tokens/BasicTokenNS.sol)

**↗ Extends: [ERC20BasicNS](ERC20BasicNS.md)**
**↘ Derived Contracts: [NonStandardToken](NonStandardToken.md)**

**{{ContractName}}**

Basic version of NonStandardToken, with no allowances.

## Contract Members
**Constants & Variables**

```js
mapping(address => uint256) internal balances;
uint256 internal totalSupply_;

```

## Functions

- [totalSupply()](#totalsupply)
- [transfer(address _to, uint256 _value)](#transfer)
- [balanceOf(address _owner)](#balanceof)

### totalSupply

⤾ overrides [ERC20BasicNS.totalSupply](ERC20BasicNS.md#totalsupply)

Total number of tokens in existence

```js
function totalSupply() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### transfer

⤾ overrides [ERC20BasicNS.transfer](ERC20BasicNS.md#transfer)

Transfer token for a specified address

```js
function transfer(address _to, uint256 _value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | The address to transfer to. | 
| _value | uint256 | The amount to be transferred. | 

### balanceOf

⤾ overrides [ERC20BasicNS.balanceOf](ERC20BasicNS.md#balanceof)

Gets the balance of the specified address.

```js
function balanceOf(address _owner) public view
returns(uint256)
```

**Returns**

An uint256 representing the amount owned by the passed address.

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address | The address to query the the balance of. | 

