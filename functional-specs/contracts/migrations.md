---
layout: default
title: Migrations
---

# Migrations.sol

View Source: [contracts/Migrations.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/Migrations.sol)

## Contract Members

**Constants & Variables**

```javascript
address public owner;
uint256 public last_completed_migration;
```

## Modifiers

* [restricted](migrations.md#restricted)

### restricted

```javascript
modifier restricted() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


## Functions

* [setCompleted\(uint256 completed\)](migrations.md#setcompleted)
* [upgrade\(address new\_address\)](migrations.md#upgrade)

### setCompleted

```javascript
function setCompleted(uint256 completed) public nonpayable restricted
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| completed | uint256 |  |

### upgrade

```javascript
function upgrade(address new_address) public nonpayable restricted
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| new\_address | address |  |

