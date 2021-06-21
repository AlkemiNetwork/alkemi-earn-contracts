---
layout: default
title: EIP20NonStandardInterface
---

# EIP20NonStandardInterface (EIP20NonStandardInterface.sol)

View Source: [contracts/EIP20NonStandardInterface.sol](../contracts/EIP20NonStandardInterface.sol)

**{{ContractName}}**

Version of ERC20 with no return values for `transfer` and `transferFrom`
See https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca

## Contract Members
**Constants & Variables**

```js
uint256 public totalSupply;

```

**Events**

```js
event Transfer(address indexed _from, address indexed _to, uint256  _value);
event Approval(address indexed _owner, address indexed _spender, uint256  _value);
```

## Functions

- [balanceOf(address _owner)](#balanceof)
- [transfer(address _to, uint256 _value)](#transfer)
- [transferFrom(address _from, address _to, uint256 _value)](#transferfrom)
- [approve(address _spender, uint256 _value)](#approve)
- [allowance(address _owner, address _spender)](#allowance)

### balanceOf

```js
function balanceOf(address _owner) public view
returns(balance uint256)
```

**Returns**

The balance

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address | The address from which the balance will be retrieved | 

### transfer

send `_value` token to `_to` from `msg.sender`

```js
function transfer(address _to, uint256 _value) public nonpayable
```

**Returns**

Whether the transfer was successful or not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _to | address | The address of the recipient | 
| _value | uint256 | The amount of token to be transferred | 

### transferFrom

send `_value` token to `_to` from `_from` on the condition it is approved by `_from`

```js
function transferFrom(address _from, address _to, uint256 _value) public nonpayable
```

**Returns**

Whether the transfer was successful or not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _from | address | The address of the sender | 
| _to | address | The address of the recipient | 
| _value | uint256 | The amount of token to be transferred | 

### approve

`msg.sender` approves `_spender` to spend `_value` tokens

```js
function approve(address _spender, uint256 _value) public nonpayable
returns(success bool)
```

**Returns**

Whether the approval was successful or not

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _spender | address | The address of the account able to transfer the tokens | 
| _value | uint256 | The amount of tokens to be approved for transfer | 

### allowance

```js
function allowance(address _owner, address _spender) public view
returns(remaining uint256)
```

**Returns**

Amount of remaining tokens allowed to spent

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address | The address of the account owning tokens | 
| _spender | address | The address of the account able to transfer the tokens | 

