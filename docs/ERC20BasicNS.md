---
layout: default
title: ERC20BasicNS
---

# ERC20BasicNS (Non-Standard) (ERC20BasicNS.sol)

View Source: [contracts/Tokens/ERC20BasicNS.sol](../contracts/Tokens/ERC20BasicNS.sol)

**↘ Derived Contracts: [BasicTokenNS](BasicTokenNS.md), [ERC20NS](ERC20NS.md)**

**{{ContractName}}**

Version of ERC20 with no return values for `transfer` and `transferFrom`
See https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca

**Events**

```js
event Transfer(address indexed from, address indexed to, uint256  value);
```

## Functions

- [totalSupply()](#totalsupply)
- [balanceOf(address who)](#balanceof)
- [transfer(address to, uint256 value)](#transfer)

### totalSupply

⤿ Overridden Implementation(s): [BasicTokenNS.totalSupply](BasicTokenNS.md#totalsupply)

```js
function totalSupply() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### balanceOf

⤿ Overridden Implementation(s): [BasicTokenNS.balanceOf](BasicTokenNS.md#balanceof)

```js
function balanceOf(address who) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| who | address |  | 

### transfer

⤿ Overridden Implementation(s): [BasicTokenNS.transfer](BasicTokenNS.md#transfer)

```js
function transfer(address to, uint256 value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| to | address |  | 
| value | uint256 |  | 

