---
layout: default
title: AlkemiWETH
---

# AlkemiWETH.sol

View Source: [contracts/AlkemiWETH.sol](../contracts/AlkemiWETH.sol)

**{{ContractName}}**

## Contract Members
**Constants & Variables**

```js
string public name;
string public symbol;
uint8 public decimals;
mapping(address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowance;

```

**Events**

```js
event Approval(address indexed src, address indexed guy, uint256  wad);
event Transfer(address indexed src, address indexed dst, uint256  wad);
event Deposit(address indexed dst, uint256  wad);
event Withdrawal(address indexed src, uint256  wad);
```

## Functions

- [()](#)
- [deposit()](#deposit)
- [withdraw(address user, uint256 wad)](#withdraw)
- [totalSupply()](#totalsupply)
- [approve(address guy, uint256 wad)](#approve)
- [transfer(address dst, uint256 wad)](#transfer)
- [transferFrom(address src, address dst, uint256 wad)](#transferfrom)

### 

```js
function () public payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### deposit

```js
function deposit() public payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### withdraw

```js
function withdraw(address user, uint256 wad) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| user | address |  | 
| wad | uint256 |  | 

### totalSupply

```js
function totalSupply() public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### approve

```js
function approve(address guy, uint256 wad) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| guy | address |  | 
| wad | uint256 |  | 

### transfer

```js
function transfer(address dst, uint256 wad) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| dst | address |  | 
| wad | uint256 |  | 

### transferFrom

```js
function transferFrom(address src, address dst, uint256 wad) public nonpayable
returns(bool)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| src | address |  | 
| dst | address |  | 
| wad | uint256 |  | 

