---
layout: default
title: ChainLink
---

# ChainLink.sol

View Source: [contracts/ChainLink.sol](../contracts/ChainLink.sol)

**{{ContractName}}**

## Contract Members
**Constants & Variables**

```js
//internal members
mapping(address => contract AggregatorV3Interface) internal priceContractMapping;

//public members
mapping(address => bool) public assetsWithPriceFeedBasedOnUSD;
address public admin;
bool public paused;
address public wethAddress;
contract AggregatorV3Interface public USDETHPriceFeed;

```

**Events**

```js
event assetAdded(address  assetAddress, address  priceFeedContract);
event assetRemoved(address  assetAddress);
event adminChanged(address  oldAdmin, address  newAdmin);
event wethAddressSet(address  wethAddress);
event USDETHPriceFeedSet(address  USDETHPriceFeed);
event contractPausedOrUnpaused(bool  currentStatus);
```

## Modifiers

- [onlyAdmin](#onlyadmin)

### onlyAdmin

```js
modifier onlyAdmin() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [addAsset(address assetAddress, address priceFeedContract, bool _assetWithPriceFeedBasedOnUSD)](#addasset)
- [removeAsset(address assetAddress)](#removeasset)
- [changeAdmin(address newAdmin)](#changeadmin)
- [setWethAddress(address _wethAddress)](#setwethaddress)
- [setUSDETHPriceFeedAddress(AggregatorV3Interface _USDETHPriceFeed)](#setusdethpricefeedaddress)
- [togglePause()](#togglepause)
- [getAssetPrice(address asset)](#getassetprice)
- [fallback()](#fallback)

### addAsset

```js
function addAsset(address assetAddress, address priceFeedContract, bool _assetWithPriceFeedBasedOnUSD) public nonpayable onlyAdmin 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| assetAddress | address |  | 
| priceFeedContract | address |  | 
| _assetWithPriceFeedBasedOnUSD | bool |  | 

### removeAsset

```js
function removeAsset(address assetAddress) public nonpayable onlyAdmin 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| assetAddress | address |  | 

### changeAdmin

```js
function changeAdmin(address newAdmin) public nonpayable onlyAdmin 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newAdmin | address |  | 

### setWethAddress

```js
function setWethAddress(address _wethAddress) public nonpayable onlyAdmin 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _wethAddress | address |  | 

### setUSDETHPriceFeedAddress

```js
function setUSDETHPriceFeedAddress(AggregatorV3Interface _USDETHPriceFeed) public nonpayable onlyAdmin 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _USDETHPriceFeed | AggregatorV3Interface |  | 

### togglePause

```js
function togglePause() public nonpayable onlyAdmin 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getAssetPrice

```js
function getAssetPrice(address asset) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 

### fallback

```js
function fallback() public payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

