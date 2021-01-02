---
layout: default
title: TestTokens
---

# TestTokens.sol

View Source: [contracts/TestTokens.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/TestTokens.sol)

## Contract Members

**Constants & Variables**

```javascript
string public name;
string public symbol;
uint8 public decimals;
uint256 public supply;
mapping(address => uint256) public balances;
mapping(address => mapping(address => uint256)) public allowed;
```

**Events**

```javascript
event Transfer(address  sender, address  receiver, uint256  tokens);
event Approval(address  sender, address  delegate, uint256  tokens);
```

## Functions

* [totalSupply\(\)](testtokens.md#totalsupply)
* [balanceOf\(address tokenOwner\)](testtokens.md#balanceof)
* [transfer\(address receiver, uint256 numTokens\)](testtokens.md#transfer)
* [approve\(address delegate, uint256 numTokens\)](testtokens.md#approve)
* [allowance\(address owner, address delegate\)](testtokens.md#allowance)
* [transferFrom\(address owner, address buyer, uint256 numTokens\)](testtokens.md#transferfrom)
* [allocateTo\(address \_owner, uint256 value\)](testtokens.md#allocateto)

### totalSupply

```javascript
function totalSupply() external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### balanceOf

```javascript
function balanceOf(address tokenOwner) external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| tokenOwner | address |  |

### transfer

```javascript
function transfer(address receiver, uint256 numTokens) external nonpayable
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| receiver | address |  |
| numTokens | uint256 |  |

### approve

```javascript
function approve(address delegate, uint256 numTokens) external nonpayable
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| delegate | address |  |
| numTokens | uint256 |  |

### allowance

```javascript
function allowance(address owner, address delegate) external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| owner | address |  |
| delegate | address |  |

### transferFrom

```javascript
function transferFrom(address owner, address buyer, uint256 numTokens) external nonpayable
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| owner | address |  |
| buyer | address |  |
| numTokens | uint256 |  |

### allocateTo

```javascript
function allocateTo(address _owner, uint256 value) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_owner | address |  |
| value | uint256 |  |

