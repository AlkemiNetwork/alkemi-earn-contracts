# ChainLink.sol

View Source: [contracts/ChainLink.sol](../contracts/ChainLink.sol)

**ChainLink**

## Contract Members
**Constants & Variables**

```js
//internal members
mapping(address => contract AggregatorV3Interface) internal priceContractMapping;

//public members
address public admin;
bool public paused;
address public wethAddress;

```

**Events**

```js
event assetAdded(address  assetAddress, address  priceFeedContract);
event assetRemoved(address  assetAddress);
event adminChanged(address  oldAdmin, address  newAdmin);
event wethAddressSet(address  wethAddress);
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

- [addAsset(address assetAddress, address priceFeedContract)](#addasset)
- [removeAsset(address assetAddress)](#removeasset)
- [changeAdmin(address newAdmin)](#changeadmin)
- [setWethAddress(address _wethAddress)](#setwethaddress)
- [togglePause()](#togglepause)
- [getAssetPrice(address asset)](#getassetprice)
- [fallback()](#fallback)

### addAsset

```js
function addAsset(address assetAddress, address priceFeedContract) public nonpayable onlyAdmin 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| assetAddress | address |  | 
| priceFeedContract | address |  | 

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

## Contracts

* [AggregatorV3Interface](AggregatorV3Interface.md)
* [AlkemiRateModel](AlkemiRateModel.md)
* [AlkemiWETH](AlkemiWETH.md)
* [CarefulMath](CarefulMath.md)
* [ChainLink](ChainLink.md)
* [EIP20Interface](EIP20Interface.md)
* [EIP20NonStandardInterface](EIP20NonStandardInterface.md)
* [ErrorReporter](ErrorReporter.md)
* [ExchangeRateModel](ExchangeRateModel.md)
* [Exponential](Exponential.md)
* [InterestRateModel](InterestRateModel.md)
* [JumpRateModel](JumpRateModel.md)
* [JumpRateModelV2](JumpRateModelV2.md)
* [LiquidationChecker](LiquidationChecker.md)
* [Liquidator](Liquidator.md)
* [Migrations](Migrations.md)
* [MoneyMarket](MoneyMarket.md)
* [PriceOracle](PriceOracle.md)
* [PriceOracleInterface](PriceOracleInterface.md)
* [PriceOracleProxy](PriceOracleProxy.md)
* [SafeMath](SafeMath.md)
* [SafeToken](SafeToken.md)
* [StableCoinInterestRateModel](StableCoinInterestRateModel.md)
* [StandardInterestRateModel](StandardInterestRateModel.md)
* [TestTokens](TestTokens.md)
