---
layout: default
title: PriceOracle
---

# PriceOracle.sol

View Source: [contracts/PriceOracle.sol](../contracts/PriceOracle.sol)

**↗ Extends: [Exponential](Exponential.md)**

**{{ContractName}}**

**Enums**
### OracleError

```js
enum OracleError {
 NO_ERROR,
 UNAUTHORIZED,
 FAILED_TO_SET_PRICE
}
```

### OracleFailureInfo

```js
enum OracleFailureInfo {
 ACCEPT_ANCHOR_ADMIN_PENDING_ANCHOR_ADMIN_CHECK,
 SET_PAUSED_OWNER_CHECK,
 SET_PENDING_ANCHOR_ADMIN_OWNER_CHECK,
 SET_PENDING_ANCHOR_PERMISSION_CHECK,
 SET_PRICE_CALCULATE_SWING,
 SET_PRICE_CAP_TO_MAX,
 SET_PRICE_MAX_SWING_CHECK,
 SET_PRICE_NO_ANCHOR_PRICE_OR_INITIAL_PRICE_ZERO,
 SET_PRICE_PERMISSION_CHECK,
 SET_PRICE_ZERO_PRICE,
 SET_PRICES_PARAM_VALIDATION,
 SET_PRICE_IS_READER_ASSET
}
```

## Structs
### ExchangeRateInfo

```js
struct ExchangeRateInfo {
 address exchangeRateModel,
 uint256 exchangeRate,
 uint256 maxSwingRate,
 uint256 maxSwingDuration
}
```

### Anchor

```js
struct Anchor {
 uint256 period,
 uint256 priceMantissa
}
```

### SetPriceLocalVars

```js
struct SetPriceLocalVars {
 struct Exponential.Exp price,
 struct Exponential.Exp swing,
 struct Exponential.Exp anchorPrice,
 uint256 anchorPeriod,
 uint256 currentPeriod,
 bool priceCapped,
 uint256 cappingAnchorPriceMantissa,
 uint256 pendingAnchorMantissa
}
```

## Contract Members
**Constants & Variables**

```js
bool public paused;
uint256 public constant numBlocksPerPeriod;
uint256 public constant maxSwingMantissa;
mapping(address => struct PriceOracle.ExchangeRateInfo) public exchangeRates;
mapping(address => struct Exponential.Exp) public _assetPrices;
address public anchorAdmin;
address public pendingAnchorAdmin;
address public poster;
struct Exponential.Exp public maxSwing;
mapping(address => struct PriceOracle.Anchor) public anchors;
mapping(address => uint256) public pendingAnchors;

```

**Events**

```js
event OracleFailure(address  msgSender, address  asset, uint256  error, uint256  info, uint256  detail);
event NewPendingAnchor(address  anchorAdmin, address  asset, uint256  oldScaledPrice, uint256  newScaledPrice);
event SetExchangeRate(address  asset, address  exchangeRateModel, uint256  exchangeRate, uint256  maxSwingRate, uint256  maxSwingDuration);
event SetMaxSwingRate(address  asset, uint256  oldMaxSwingRate, uint256  newMaxSwingRate, uint256  maxSwingDuration);
event PricePosted(address  asset, uint256  previousPriceMantissa, uint256  requestedPriceMantissa, uint256  newPriceMantissa);
event CappedPricePosted(address  asset, uint256  requestedPriceMantissa, uint256  anchorPriceMantissa, uint256  cappedPriceMantissa);
event SetPaused(bool  newState);
event NewPendingAnchorAdmin(address  oldPendingAnchorAdmin, address  newPendingAnchorAdmin);
event NewAnchorAdmin(address  oldAnchorAdmin, address  newAnchorAdmin);
event NewPoster(address  oldPoster, address  newPoster);
```

## Functions

- [scale()](#scale)
- [getExchangeRate()](#getexchangerate)
- [getMaxSwingRate(uint256 interval)](#getmaxswingrate)
- [getFixedInterestRate(uint256 interval)](#getfixedinterestrate)
- [getFixedExchangeRate(uint256 interval)](#getfixedexchangerate)
- [()](#)
- [failOracle(address asset, enum PriceOracle.OracleError err, enum PriceOracle.OracleFailureInfo info)](#failoracle)
- [failOracleWithDetails(address asset, enum PriceOracle.OracleError err, enum PriceOracle.OracleFailureInfo info, uint256 details)](#failoraclewithdetails)
- [_setPendingAnchor(address asset, uint256 newScaledPrice)](#_setpendinganchor)
- [_setPaused(bool requestedState)](#_setpaused)
- [_setPendingAnchorAdmin(address newPendingAnchorAdmin)](#_setpendinganchoradmin)
- [_acceptAnchorAdmin()](#_acceptanchoradmin)
- [_setPoster(address newPoster)](#_setposter)
- [setExchangeRate(address asset, address exchangeRateModel, uint256 maxSwingDuration)](#setexchangerate)
- [setMaxSwingRate(address asset, uint256 maxSwingDuration)](#setmaxswingrate)
- [assetPrices(address asset)](#assetprices)
- [getPrice(address asset)](#getprice)
- [setPrice(address asset, uint256 requestedPriceMantissa)](#setprice)
- [setPriceInternal(address asset, uint256 requestedPriceMantissa)](#setpriceinternal)
- [setPriceStorageInternal(address asset, uint256 priceMantissa)](#setpricestorageinternal)
- [calculateSwing(struct Exponential.Exp anchorPrice, struct Exponential.Exp price)](#calculateswing)
- [capToMax(struct Exponential.Exp anchorPrice, struct Exponential.Exp price)](#captomax)
- [setPrices(address[] assets, uint256[] requestedPriceMantissas)](#setprices)

### scale

```js
function scale() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getExchangeRate

```js
function getExchangeRate() external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getMaxSwingRate

```js
function getMaxSwingRate(uint256 interval) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| interval | uint256 |  | 

### getFixedInterestRate

```js
function getFixedInterestRate(uint256 interval) external view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| interval | uint256 |  | 

### getFixedExchangeRate

```js
function getFixedExchangeRate(uint256 interval) public view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| interval | uint256 |  | 

### 

Do not pay into PriceOracle

```js
function () public payable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### failOracle

use this when reporting a known error from the price oracle or a non-upgradeable collaborator
     Using Oracle in name because we already inherit a `fail` function from ErrorReporter.sol via Exponential.sol

```js
function failOracle(address asset, enum PriceOracle.OracleError err, enum PriceOracle.OracleFailureInfo info) internal nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| err | enum PriceOracle.OracleError |  | 
| info | enum PriceOracle.OracleFailureInfo |  | 

### failOracleWithDetails

Use this when reporting an error from the Alkemi Earn Verified. Give the Alkemi Earn Verified result as `details`

```js
function failOracleWithDetails(address asset, enum PriceOracle.OracleError err, enum PriceOracle.OracleFailureInfo info, uint256 details) internal nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| err | enum PriceOracle.OracleError |  | 
| info | enum PriceOracle.OracleFailureInfo |  | 
| details | uint256 |  | 

### _setPendingAnchor

provides ability to override the anchor price for an asset

```js
function _setPendingAnchor(address asset, uint256 newScaledPrice) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure (see enum OracleError for details)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | Asset for which to override the anchor price | 
| newScaledPrice | uint256 | New anchor price | 

### _setPaused

set `paused` to the specified state

```js
function _setPaused(bool requestedState) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| requestedState | bool | value to assign to `paused` | 

### _setPendingAnchorAdmin

Begins transfer of anchor admin rights. The newPendingAnchorAdmin must call `_acceptAnchorAdmin` to finalize the transfer.

```js
function _setPendingAnchorAdmin(address newPendingAnchorAdmin) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure
     * TODO: Should we add a second arg to verify, like a checksum of `newAnchorAdmin` address?

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newPendingAnchorAdmin | address | New pending anchor admin. | 

### _acceptAnchorAdmin

Accepts transfer of anchor admin rights. msg.sender must be pendingAnchorAdmin

```js
function _acceptAnchorAdmin() public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### _setPoster

Set new poster.

```js
function _setPoster(address newPoster) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure
     * TODO: Should we add a second arg to verify, like a checksum of `newAnchorAdmin` address?

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| newPoster | address | New poster. | 

### setExchangeRate

set new exchange rate model

```js
function setExchangeRate(address asset, address exchangeRateModel, uint256 maxSwingDuration) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure (see enum OracleError for details)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | asset for which to set the exchangeRateModel | 
| exchangeRateModel | address | exchangeRateModel address, if the exchangeRateModel is address(0), cancel the exchangeRates | 
| maxSwingDuration | uint256 | maxSwingDuration uint, Is a value greater than zero and less than a second of a week | 

### setMaxSwingRate

set new exchange rate maxSwingRate

```js
function setMaxSwingRate(address asset, uint256 maxSwingDuration) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure (see enum OracleError for details)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | asset for which to set the exchange rate maxSwingRate | 
| maxSwingDuration | uint256 | Interval time | 

### assetPrices

retrieves price of an asset

```js
function assetPrices(address asset) public view
returns(uint256)
```

**Returns**

uint mantissa of asset price (scaled by 1e18) or zero if unset or contract paused

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | Asset for which to get the price | 

### getPrice

retrieves price of an asset

```js
function getPrice(address asset) public view
returns(uint256)
```

**Returns**

uint mantissa of asset price (scaled by 1e18) or zero if unset or contract paused

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | Asset for which to get the price | 

### setPrice

entry point for updating prices

```js
function setPrice(address asset, uint256 requestedPriceMantissa) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure (see enum OracleError for details)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | Asset for which to set the price | 
| requestedPriceMantissa | uint256 | requested new price, scaled by 10**18 | 

### setPriceInternal

```js
function setPriceInternal(address asset, uint256 requestedPriceMantissa) internal nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| requestedPriceMantissa | uint256 |  | 

### setPriceStorageInternal

```js
function setPriceStorageInternal(address asset, uint256 priceMantissa) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| priceMantissa | uint256 |  | 

### calculateSwing

```js
function calculateSwing(struct Exponential.Exp anchorPrice, struct Exponential.Exp price) internal pure
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| anchorPrice | struct Exponential.Exp |  | 
| price | struct Exponential.Exp |  | 

### capToMax

```js
function capToMax(struct Exponential.Exp anchorPrice, struct Exponential.Exp price) internal view
returns(enum ErrorReporter.Error, bool, struct Exponential.Exp)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| anchorPrice | struct Exponential.Exp |  | 
| price | struct Exponential.Exp |  | 

### setPrices

entry point for updating multiple prices

```js
function setPrices(address[] assets, uint256[] requestedPriceMantissas) public nonpayable
returns(uint256[])
```

**Returns**

uint values in same order as inputs. For each: 0=success, otherwise a failure (see enum OracleError for details)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| assets | address[] | a list of up to assets for which to set a price. required: 0 < assets.length == requestedPriceMantissas.length | 
| requestedPriceMantissas | uint256[] | requested new prices for the assets, scaled by 10**18. required: 0 < assets.length == requestedPriceMantissas.length | 

