---
layout: default
title: ChainLink
---

# ChainLink.sol

View Source: [contracts/ChainLink.sol](../contracts/ChainLink.sol)

### Contract Members

**Constants & Variables**

```javascript
//internal members
mapping(address => contract AggregatorV3Interface) internal priceContractMapping;
uint256 internal constant expScale;
uint8 internal constant eighteen;

//public members
address public admin;
bool public paused;
address public wethAddressVerified;
address public wethAddressPublic;
contract AggregatorV3Interface public USDETHPriceFeed;
```

**Events**

```javascript
event assetAdded(address indexed assetAddress, address indexed priceFeedContract);
event assetRemoved(address indexed assetAddress);
event adminChanged(address indexed oldAdmin, address indexed newAdmin);
event verifiedWethAddressSet(address indexed wethAddressVerified);
event publicWethAddressSet(address indexed wethAddressPublic);
event contractPausedOrUnpaused(bool  currentStatus);
```

### Modifiers

* onlyAdmin

#### onlyAdmin

```javascript
modifier onlyAdmin() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### Functions

* addAsset\(address assetAddress, address priceFeedContract\)
* removeAsset\(address assetAddress\)
* changeAdmin\(address newAdmin\)
* setWethAddressVerified\(address \_wethAddressVerified\)
* setWethAddressPublic\(address \_wethAddressPublic\)
* togglePause\(\)
* getAssetPrice\(address asset\)
* \(\)

#### addAsset

```javascript
function addAsset(address assetAddress, address priceFeedContract) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| assetAddress | address |  |
| priceFeedContract | address |  |

#### removeAsset

```javascript
function removeAsset(address assetAddress) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| assetAddress | address |  |

#### changeAdmin

```javascript
function changeAdmin(address newAdmin) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| newAdmin | address |  |

#### setWethAddressVerified

```javascript
function setWethAddressVerified(address _wethAddressVerified) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_wethAddressVerified | address |  |

#### setWethAddressPublic

```javascript
function setWethAddressPublic(address _wethAddressPublic) public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_wethAddressPublic | address |  |

#### togglePause

```javascript
function togglePause() public nonpayable onlyAdmin
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### getAssetPrice

```javascript
function getAssetPrice(address asset) public view
returns(uint256, uint8)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |

#### 

```javascript
function () public payable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


