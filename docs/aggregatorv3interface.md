---
layout: default
title: AggregatorV3Interface
---

# AggregatorV3Interface.sol

View Source: [contracts/AggregatorV3Interface.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/AggregatorV3Interface.sol)



### Functions

* decimals\(\)
* description\(\)
* version\(\)
* getRoundData\(uint80 \_roundId\)
* latestRoundData\(\)

#### decimals

```javascript
function decimals() external view
returns(uint8)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### description

```javascript
function description() external view
returns(string)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### version

```javascript
function version() external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### getRoundData

```javascript
function getRoundData(uint80 _roundId) external view
returns(roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_roundId | uint80 |  |

#### latestRoundData

```javascript
function latestRoundData() external view
returns(roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


