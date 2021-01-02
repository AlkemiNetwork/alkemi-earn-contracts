---
layout: default
title: ERC20
---

# ERC20 interface (ERC20.sol)

View Source: [contracts/Tokens/ERC20.sol](../contracts/Tokens/ERC20.sol)

**↗ Extends: [ERC20Basic](ERC20Basic.md)**
**↘ Derived Contracts: [StandardToken](StandardToken.md)**

**{{ContractName}}**

see https://github.com/ethereum/EIPs/issues/20

**Events**

```js
event Approval(address indexed owner, address indexed spender, uint256  value);
```

## Functions

- [allowance(address owner, address spender)](#allowance)
- [transferFrom(address from, address to, uint256 value)](#transferfrom)
- [approve(address spender, uint256 value)](#approve)

### allowance

⤿ Overridden Implementation(s): [StandardToken.allowance](StandardToken.md#allowance)

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

⤿ Overridden Implementation(s): [StandardToken.transferFrom](StandardToken.md#transferfrom)

```js
function transferFrom(address from, address to, uint256 value) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| from | address |  | 
| to | address |  | 
| value | uint256 |  | 

### approve

⤿ Overridden Implementation(s): [StandardToken.approve](StandardToken.md#approve)

```js
function approve(address spender, uint256 value) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| spender | address |  | 
| value | uint256 |  | 

