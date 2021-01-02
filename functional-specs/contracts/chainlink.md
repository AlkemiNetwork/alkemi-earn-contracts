---
layout: default
title: ChainLink
---

# ChainLink.sol

View Source: [contracts/ChainLink.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/ChainLink.sol)

## Contract Members

**Constants & Variables**

```javascript
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

```javascript
event assetAdded(address  assetAddress, address  priceFeedContract);
event assetRemoved(address  assetAddress);
event adminChanged(address  oldAdmin, address  newAdmin);
event wethAddressSet(address  wethAddress);
event USDETHPriceFeedSet(address  USDETHPriceFeed);
event contractPausedOrUnpaused(bool  currentStatus);
```

## Modifiers

* [onlyAdmin](chainlink.md#onlyadmin)

### onlyAdmin

```javascript
modifier onlyAdmin() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


## Functions

* [addAsset\(address assetAddress, address priceFeedContract, bool \_assetWithPriceFeedBasedOnUSD\)](chainlink.md#addasset)
* [removeAsset\(address assetAddress\)](chainlink.md#removeasset)
* [changeAdmin\(address newAdmin\)](chainlink.md#changeadmin)
* [setWethAddress\(address \_wethAddress\)](chainlink.md#setwethaddress)
* [setUSDETHPriceFeedAddress\(AggregatorV3Interface \_USDETHPriceFeed\)](chainlink.md#setusdethpricefeedaddress)
* [togglePause\(\)](chainlink.md#togglepause)
* [getAssetPrice\(address asset\)](chainlink.md#getassetprice)
* [fallback\(\)](chainlink.md#fallback)

### addAsset

```javascript
function addAsset(address assetAddress, address priceFeedContract, bool _assetWithPriceFeedBasedOnUSD) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| assetAddress | address |  |
| priceFeedContract | address |  |
| \_assetWithPriceFeedBasedOnUSD | bool |  |

### removeAsset

```javascript
function removeAsset(address assetAddress) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| assetAddress | address |  |

### changeAdmin

```javascript
function changeAdmin(address newAdmin) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| newAdmin | address |  |

### setWethAddress

```javascript
function setWethAddress(address _wethAddress) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_wethAddress | address |  |

### setUSDETHPriceFeedAddress

```javascript
function setUSDETHPriceFeedAddress(AggregatorV3Interface _USDETHPriceFeed) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_USDETHPriceFeed | AggregatorV3Interface |  |

### togglePause

```javascript
function togglePause() public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### getAssetPrice

```javascript
function getAssetPrice(address asset) public view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |

### fallback

```javascript
function fallback() public payable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


