---
layout: default
title: AggregatorV3Interface
---

# AggregatorV3Interface.sol

View Source: [contracts/AggregatorV3Interface.sol](../contracts/AggregatorV3Interface.sol)

**{{ContractName}}**

## Functions

- [decimals()](#decimals)
- [description()](#description)
- [version()](#version)
- [getRoundData(uint80 _roundId)](#getrounddata)
- [latestRoundData()](#latestrounddata)

### decimals

```js
function decimals() external view
returns(uint8)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### description

```js
function description() external view
returns(string)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### version

```js
function version() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getRoundData

```js
function getRoundData(uint80 _roundId) external view
returns(roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _roundId | uint80 |  | 

### latestRoundData

```js
function latestRoundData() external view
returns(roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

