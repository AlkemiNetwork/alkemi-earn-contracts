---
layout: default
title: ERC20NS
---

# ERC20 interface (non-standard) (ERC20NS.sol)

View Source: [contracts/Tokens/ERC20NS.sol](../contracts/Tokens/ERC20NS.sol)

**↗ Extends: [ERC20BasicNS](ERC20BasicNS.md)**
**↘ Derived Contracts: [NonStandardToken](NonStandardToken.md)**

**{{ContractName}}**

Version of ERC20 with no return values for `transfer` and `transferFrom`
See https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca

**Events**

```js
event Approval(address indexed owner, address indexed spender, uint256  value);
```

## Functions

- [allowance(address owner, address spender)](#allowance)
- [transferFrom(address from, address to, uint256 value)](#transferfrom)
- [approve(address spender, uint256 value)](#approve)

### allowance

⤿ Overridden Implementation(s): [NonStandardToken.allowance](NonStandardToken.md#allowance)

```js
function allowance(address owner, address spender) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| owner | address |  | 
| spender | address |  | 

### transferFrom

⤿ Overridden Implementation(s): [NonStandardToken.transferFrom](NonStandardToken.md#transferfrom)

```js
function transferFrom(address from, address to, uint256 value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| from | address |  | 
| to | address |  | 
| value | uint256 |  | 

### approve

⤿ Overridden Implementation(s): [NonStandardToken.approve](NonStandardToken.md#approve)

```js
function approve(address spender, uint256 value) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| spender | address |  | 
| value | uint256 |  | 

