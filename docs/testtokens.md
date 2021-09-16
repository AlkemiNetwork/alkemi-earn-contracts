---
layout: default
title: TestTokens
---

# TestTokens.sol

View Source: [contracts/TestTokens.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/TestTokens.sol)



### Contract Members

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

### Functions

* totalSupply\(\)
* balanceOf\(address tokenOwner\)
* transfer\(address receiver, uint256 numTokens\)
* approve\(address delegate, uint256 numTokens\)
* allowance\(address owner, address delegate\)
* transferFrom\(address owner, address buyer, uint256 numTokens\)
* allocateTo\(address \_owner, uint256 value\)

#### totalSupply

```javascript
function totalSupply() external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### balanceOf

```javascript
function balanceOf(address tokenOwner) external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| tokenOwner | address |  |

#### transfer

```javascript
function transfer(address receiver, uint256 numTokens) external nonpayable
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| receiver | address |  |
| numTokens | uint256 |  |

#### approve

```javascript
function approve(address delegate, uint256 numTokens) external nonpayable
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| delegate | address |  |
| numTokens | uint256 |  |

#### allowance

```javascript
function allowance(address owner, address delegate) external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| owner | address |  |
| delegate | address |  |

#### transferFrom

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

#### allocateTo

```javascript
function allocateTo(address _owner, uint256 value) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_owner | address |  |
| value | uint256 |  |

