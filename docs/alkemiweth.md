---
layout: default
title: AlkemiWETH
---

# AlkemiWETH.sol

View Source: [contracts/AlkemiWETH.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/AlkemiWETH.sol)



### Contract Members

**Constants & Variables**

```javascript
string public name;
string public symbol;
uint8 public decimals;
mapping(address => uint256) public balanceOf;
mapping(address => mapping(address => uint256)) public allowance;
```

**Events**

```javascript
event Approval(address indexed src, address indexed guy, uint256  wad);
event Transfer(address indexed src, address indexed dst, uint256  wad);
event Deposit(address indexed dst, uint256  wad);
event Withdrawal(address indexed src, uint256  wad);
```

### Functions

* \(\)
* deposit\(\)
* withdraw\(address user, uint256 wad\)
* totalSupply\(\)
* approve\(address guy, uint256 wad\)
* transfer\(address dst, uint256 wad\)
* transferFrom\(address src, address dst, uint256 wad\)

#### 

```javascript
function () public payable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### deposit

```javascript
function deposit() public payable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### withdraw

```javascript
function withdraw(address user, uint256 wad) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| user | address |  |
| wad | uint256 |  |

#### totalSupply

```javascript
function totalSupply() public view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### approve

```javascript
function approve(address guy, uint256 wad) public nonpayable
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| guy | address |  |
| wad | uint256 |  |

#### transfer

```javascript
function transfer(address dst, uint256 wad) public nonpayable
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| dst | address |  |
| wad | uint256 |  |

#### transferFrom

```javascript
function transferFrom(address src, address dst, uint256 wad) public nonpayable
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| src | address |  |
| dst | address |  |
| wad | uint256 |  |

