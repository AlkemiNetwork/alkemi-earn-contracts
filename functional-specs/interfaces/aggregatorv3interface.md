---
layout: default
title: AggregatorV3Interface
---

# AggregatorV3Interface.sol

View Source: [contracts/AggregatorV3Interface.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/AggregatorV3Interface.sol)

## Functions

* [decimals\(\)](aggregatorv3interface.md#decimals)
* [description\(\)](aggregatorv3interface.md#description)
* [version\(\)](aggregatorv3interface.md#version)
* [getRoundData\(uint80 \_roundId\)](aggregatorv3interface.md#getrounddata)
* [latestRoundData\(\)](aggregatorv3interface.md#latestrounddata)

### decimals

```javascript
function decimals() external view
returns(uint8)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### description

```javascript
function description() external view
returns(string)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### version

```javascript
function version() external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### getRoundData

```javascript
function getRoundData(uint80 _roundId) external view
returns(roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_roundId | uint80 |  |

### latestRoundData

```javascript
function latestRoundData() external view
returns(roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


