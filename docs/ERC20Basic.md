---
layout: default
title: ERC20Basic
---

# ERC20Basic (ERC20Basic.sol)

View Source: [contracts/Tokens/ERC20Basic.sol](../contracts/Tokens/ERC20Basic.sol)

**↘ Derived Contracts: [BasicToken](BasicToken.md), [ERC20](ERC20.md)**

**{{ContractName}}**

Simpler version of ERC20 interface
See https://github.com/ethereum/EIPs/issues/179

**Events**

```js
event Transfer(address indexed from, address indexed to, uint256  value);
```

## Functions

- [totalSupply()](#totalsupply)
- [balanceOf(address who)](#balanceof)
- [transfer(address to, uint256 value)](#transfer)

### totalSupply

⤿ Overridden Implementation(s): [BasicToken.totalSupply](BasicToken.md#totalsupply)

```js
function totalSupply() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### balanceOf

⤿ Overridden Implementation(s): [BasicToken.balanceOf](BasicToken.md#balanceof)

```js
function balanceOf(address who) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| who | address |  | 

### transfer

⤿ Overridden Implementation(s): [BasicToken.transfer](BasicToken.md#transfer)

```js
function transfer(address to, uint256 value) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| to | address |  | 
| value | uint256 |  | 

