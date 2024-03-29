---
layout: default
title: TestTokens
---

# TestTokens.sol

View Source: [contracts/TestTokens.sol](../contracts/TestTokens.sol)

**{{ContractName}}**

## Contract Members
**Constants & Variables**

```js
string public name;
string public symbol;
uint8 public decimals;
uint256 public supply;
mapping(address => uint256) public balances;
mapping(address => mapping(address => uint256)) public allowed;

```

**Events**

```js
event Transfer(address  sender, address  receiver, uint256  tokens);
event Approval(address  sender, address  delegate, uint256  tokens);
```

## Functions

- [totalSupply()](#totalsupply)
- [balanceOf(address tokenOwner)](#balanceof)
- [transfer(address receiver, uint256 numTokens)](#transfer)
- [approve(address delegate, uint256 numTokens)](#approve)
- [allowance(address owner, address delegate)](#allowance)
- [transferFrom(address owner, address buyer, uint256 numTokens)](#transferfrom)
- [allocateTo(address _owner, uint256 value)](#allocateto)

### totalSupply

```js
function totalSupply() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### balanceOf

```js
function balanceOf(address tokenOwner) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| tokenOwner | address |  | 

### transfer

```js
function transfer(address receiver, uint256 numTokens) external nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| receiver | address |  | 
| numTokens | uint256 |  | 

### approve

```js
function approve(address delegate, uint256 numTokens) external nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| delegate | address |  | 
| numTokens | uint256 |  | 

### allowance

```js
function allowance(address owner, address delegate) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| owner | address |  | 
| delegate | address |  | 

### transferFrom

```js
function transferFrom(address owner, address buyer, uint256 numTokens) external nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| owner | address |  | 
| buyer | address |  | 
| numTokens | uint256 |  | 

### allocateTo

```js
function allocateTo(address _owner, uint256 value) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address |  | 
| value | uint256 |  | 

