---
layout: default
title: Migrations
---

# Migrations.sol

View Source: [contracts/Migrations.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/Migrations.sol)



### Contract Members

**Constants & Variables**

```javascript
address public owner;
uint256 public last_completed_migration;
```

### Modifiers

* restricted

#### restricted

```javascript
modifier restricted() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### Functions

* setCompleted\(uint256 completed\)
* upgrade\(address new\_address\)

#### setCompleted

```javascript
function setCompleted(uint256 completed) public nonpayable restricted
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| completed | uint256 |  |

#### upgrade

```javascript
function upgrade(address new_address) public nonpayable restricted
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| new\_address | address |  |

