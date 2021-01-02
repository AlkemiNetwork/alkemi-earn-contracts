---
layout: default
title: MoneyMarket
---

# MoneyMarket.sol

View Source: [contracts/MoneyMarket.sol](https://github.com/project-alkemi/alkemi-earn-protocol/tree/2a353e0fa125b9f579db260fbb031d53b74bf7e2/contracts/MoneyMarket.sol)

**↗ Extends:** [**Exponential**](../libraries/exponential.md)**,** [**SafeToken**](../libraries/safetoken.md)

## Structs

### Balance

```javascript
struct Balance {
 uint256 principal,
 uint256 interestIndex
}
```

### Market

```javascript
struct Market {
 bool isSupported,
 uint256 blockNumber,
 contract InterestRateModel interestRateModel,
 uint256 totalSupply,
 uint256 supplyRateMantissa,
 uint256 supplyIndex,
 uint256 totalBorrows,
 uint256 borrowRateMantissa,
 uint256 borrowIndex
}
```

### SupplyLocalVars

```javascript
struct SupplyLocalVars {
 uint256 startingBalance,
 uint256 newSupplyIndex,
 uint256 userSupplyCurrent,
 uint256 userSupplyUpdated,
 uint256 newTotalSupply,
 uint256 currentCash,
 uint256 updatedCash,
 uint256 newSupplyRateMantissa,
 uint256 newBorrowIndex,
 uint256 newBorrowRateMantissa
}
```

### WithdrawLocalVars

```javascript
struct WithdrawLocalVars {
 uint256 withdrawAmount,
 uint256 startingBalance,
 uint256 newSupplyIndex,
 uint256 userSupplyCurrent,
 uint256 userSupplyUpdated,
 uint256 newTotalSupply,
 uint256 currentCash,
 uint256 updatedCash,
 uint256 newSupplyRateMantissa,
 uint256 newBorrowIndex,
 uint256 newBorrowRateMantissa,
 struct Exponential.Exp accountLiquidity,
 struct Exponential.Exp accountShortfall,
 struct Exponential.Exp ethValueOfWithdrawal,
 uint256 withdrawCapacity
}
```

### AccountValueLocalVars

```javascript
struct AccountValueLocalVars {
 address assetAddress,
 uint256 collateralMarketsLength,
 uint256 newSupplyIndex,
 uint256 userSupplyCurrent,
 struct Exponential.Exp supplyTotalValue,
 struct Exponential.Exp sumSupplies,
 uint256 newBorrowIndex,
 uint256 userBorrowCurrent,
 struct Exponential.Exp borrowTotalValue,
 struct Exponential.Exp sumBorrows
}
```

### PayBorrowLocalVars

```javascript
struct PayBorrowLocalVars {
 uint256 newBorrowIndex,
 uint256 userBorrowCurrent,
 uint256 repayAmount,
 uint256 userBorrowUpdated,
 uint256 newTotalBorrows,
 uint256 currentCash,
 uint256 updatedCash,
 uint256 newSupplyIndex,
 uint256 newSupplyRateMantissa,
 uint256 newBorrowRateMantissa,
 uint256 startingBalance
}
```

### BorrowLocalVars

```javascript
struct BorrowLocalVars {
 uint256 newBorrowIndex,
 uint256 userBorrowCurrent,
 uint256 borrowAmountWithFee,
 uint256 userBorrowUpdated,
 uint256 newTotalBorrows,
 uint256 currentCash,
 uint256 updatedCash,
 uint256 newSupplyIndex,
 uint256 newSupplyRateMantissa,
 uint256 newBorrowRateMantissa,
 uint256 startingBalance,
 struct Exponential.Exp accountLiquidity,
 struct Exponential.Exp accountShortfall,
 struct Exponential.Exp ethValueOfBorrowAmountWithFee
}
```

### LiquidateLocalVars

```javascript
struct LiquidateLocalVars {
 address targetAccount,
 address assetBorrow,
 address liquidator,
 address assetCollateral,
 uint256 newBorrowIndex_UnderwaterAsset,
 uint256 newSupplyIndex_UnderwaterAsset,
 uint256 newBorrowIndex_CollateralAsset,
 uint256 newSupplyIndex_CollateralAsset,
 uint256 currentBorrowBalance_TargetUnderwaterAsset,
 uint256 updatedBorrowBalance_TargetUnderwaterAsset,
 uint256 newTotalBorrows_ProtocolUnderwaterAsset,
 uint256 startingBorrowBalance_TargetUnderwaterAsset,
 uint256 startingSupplyBalance_TargetCollateralAsset,
 uint256 startingSupplyBalance_LiquidatorCollateralAsset,
 uint256 currentSupplyBalance_TargetCollateralAsset,
 uint256 updatedSupplyBalance_TargetCollateralAsset,
 uint256 currentSupplyBalance_LiquidatorCollateralAsset,
 uint256 updatedSupplyBalance_LiquidatorCollateralAsset,
 uint256 newTotalSupply_ProtocolCollateralAsset,
 uint256 currentCash_ProtocolUnderwaterAsset,
 uint256 updatedCash_ProtocolUnderwaterAsset,
 uint256 newSupplyRateMantissa_ProtocolUnderwaterAsset,
 uint256 newBorrowRateMantissa_ProtocolUnderwaterAsset,
 uint256 discountedRepayToEvenAmount,
 uint256 discountedBorrowDenominatedCollateral,
 uint256 maxCloseableBorrowAmount_TargetUnderwaterAsset,
 uint256 closeBorrowAmount_TargetUnderwaterAsset,
 uint256 seizeSupplyAmount_TargetCollateralAsset,
 struct Exponential.Exp collateralPrice,
 struct Exponential.Exp underwaterAssetPrice
}
```

## Contract Members

**Constants & Variables**

```javascript
//internal members
uint256 internal initialInterestIndex;
uint256 internal defaultOriginationFee;
uint256 internal defaultCollateralRatio;
uint256 internal defaultLiquidationDiscount;
uint256 internal minimumCollateralRatioMantissa;
uint256 internal maximumLiquidationDiscountMantissa;
contract ChainLink internal priceOracle;

//public members
bool public initializationDone;
address public pendingAdmin;
address public admin;
mapping(address => bool) public managers;
address public oracle;
mapping(address => mapping(address => struct MoneyMarket.Balance)) public supplyBalances;
mapping(address => mapping(address => struct MoneyMarket.Balance)) public borrowBalances;
address public wethAddress;
contract AlkemiWETH public WETHContract;
mapping(address => struct MoneyMarket.Market) public markets;
address[] public collateralMarkets;
struct Exponential.Exp public collateralRatio;
struct Exponential.Exp public originationFee;
struct Exponential.Exp public liquidationDiscount;
bool public paused;
mapping(address => mapping(address => uint256)) public originationFeeBalance;

//private members
mapping(address => bool) private KYCAdmins;
mapping(address => bool) private customersWithKYC;
mapping(address => bool) private liquidators;
```

**Events**

```javascript
event WETHAddressSet(address  wethAddress);
event LiquidatorAdded(address  Liquidator);
event LiquidatorRemoved(address  Liquidator);
event SupplyReceived(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  newBalance);
event SupplyOrgFeeAsAdmin(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  newBalance);
event SupplyWithdrawn(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  newBalance);
event BorrowTaken(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  borrowAmountWithFee, uint256  newBalance);
event BorrowRepaid(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  newBalance);
event BorrowLiquidated(address  targetAccount, address  assetBorrow, uint256  borrowBalanceBefore, uint256  borrowBalanceAccumulated, uint256  amountRepaid, uint256  borrowBalanceAfter, address  liquidator, address  assetCollateral, uint256  collateralBalanceBefore, uint256  collateralBalanceAccumulated, uint256  amountSeized, uint256  collateralBalanceAfter);
event NewPendingAdmin(address  oldPendingAdmin, address  newPendingAdmin);
event NewAdmin(address  oldAdmin, address  newAdmin);
event NewOracle(address  oldOracle, address  newOracle);
event SupportedMarket(address  asset, address  interestRateModel);
event NewRiskParameters(uint256  oldCollateralRatioMantissa, uint256  newCollateralRatioMantissa, uint256  oldLiquidationDiscountMantissa, uint256  newLiquidationDiscountMantissa, uint256  NewMinimumCollateralRatioMantissa, uint256  newMaximumLiquidationDiscountMantissa);
event NewOriginationFee(uint256  oldOriginationFeeMantissa, uint256  newOriginationFeeMantissa);
event SetMarketInterestRateModel(address  asset, address  interestRateModel);
event EquityWithdrawn(address  asset, uint256  equityAvailableBefore, uint256  amount, address  owner);
event SuspendedMarket(address  asset);
event SetPaused(bool  newState);
event KYCAdminAdded(address  KYCAdmin);
event KYCAdminRemoved(address  KYCAdmin);
event KYCCustomerAdded(address  KYCCustomer);
event KYCCustomerRemoved(address  KYCCustomer);
```

## Modifiers

* [onlyAdminOrManager](moneymarket.md#onlyadminormanager)
* [isKYCAdmin](moneymarket.md#iskycadmin)
* [isKYCVerifiedCustomer](moneymarket.md#iskycverifiedcustomer)
* [isLiquidator](moneymarket.md#isliquidator)

### onlyAdminOrManager

Modifier to check if the caller of the function is a manager or owner

```javascript
modifier onlyAdminOrManager() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### isKYCAdmin

Modifier to check if the caller of the function is a KYC Admin

```javascript
modifier isKYCAdmin() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### isKYCVerifiedCustomer

Modifier to check if the caller of the function is KYC verified

```javascript
modifier isKYCVerifiedCustomer() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### isLiquidator

Modifier to check if the caller of the function is a Liquidator

```javascript
modifier isLiquidator() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


## Functions

* [initializer\(\)](moneymarket.md#initializer)
* [\(\)](moneymarket.md)
* [emitError\(enum ErrorReporter.Error error, enum ErrorReporter.FailureInfo failure\)](moneymarket.md#emiterror)
* [addKYCAdmin\(address KYCAdmin\)](moneymarket.md#addkycadmin)
* [removeKYCAdmin\(address KYCAdmin\)](moneymarket.md#removekycadmin)
* [addCustomerKYC\(address customer\)](moneymarket.md#addcustomerkyc)
* [removeCustomerKYC\(address customer\)](moneymarket.md#removecustomerkyc)
* [verifyKYC\(address customer\)](moneymarket.md#verifykyc)
* [checkKYCAdmin\(address \_KYCAdmin\)](moneymarket.md#checkkycadmin)
* [addLiquidator\(address liquidator\)](moneymarket.md#addliquidator)
* [removeLiquidator\(address liquidator\)](moneymarket.md#removeliquidator)
* [verifyLiquidator\(address liquidator\)](moneymarket.md#verifyliquidator)
* [min\(uint256 a, uint256 b\)](moneymarket.md#min)
* [getBlockNumber\(\)](moneymarket.md#getblocknumber)
* [addCollateralMarket\(address asset\)](moneymarket.md#addcollateralmarket)
* [getCollateralMarketsLength\(\)](moneymarket.md#getcollateralmarketslength)
* [calculateInterestIndex\(uint256 startingInterestIndex, uint256 interestRateMantissa, uint256 blockStart, uint256 blockEnd\)](moneymarket.md#calculateinterestindex)
* [calculateBalance\(uint256 startingBalance, uint256 interestIndexStart, uint256 interestIndexEnd\)](moneymarket.md#calculatebalance)
* [getPriceForAssetAmount\(address asset, uint256 assetAmount\)](moneymarket.md#getpriceforassetamount)
* [getPriceForAssetAmountMulCollatRatio\(address asset, uint256 assetAmount\)](moneymarket.md#getpriceforassetamountmulcollatratio)
* [calculateBorrowAmountWithFee\(uint256 borrowAmount\)](moneymarket.md#calculateborrowamountwithfee)
* [fetchAssetPrice\(address asset\)](moneymarket.md#fetchassetprice)
* [assetPrices\(address asset\)](moneymarket.md#assetprices)
* [getAssetAmountForValue\(address asset, struct Exponential.Exp ethValue\)](moneymarket.md#getassetamountforvalue)
* [\_setPendingAdmin\(address newPendingAdmin\)](moneymarket.md#_setpendingadmin)
* [\_acceptAdmin\(\)](moneymarket.md#_acceptadmin)
* [\_setOracle\(address newOracle\)](moneymarket.md#_setoracle)
* [\_setPaused\(bool requestedState\)](moneymarket.md#_setpaused)
* [getAccountLiquidity\(address account\)](moneymarket.md#getaccountliquidity)
* [getSupplyBalance\(address account, address asset\)](moneymarket.md#getsupplybalance)
* [getBorrowBalance\(address account, address asset\)](moneymarket.md#getborrowbalance)
* [\_supportMarket\(address asset, InterestRateModel interestRateModel\)](moneymarket.md#_supportmarket)
* [\_suspendMarket\(address asset\)](moneymarket.md#_suspendmarket)
* [\_setRiskParameters\(uint256 collateralRatioMantissa, uint256 liquidationDiscountMantissa, uint256 \_minimumCollateralRatioMantissa, uint256 \_maximumLiquidationDiscountMantissa\)](moneymarket.md#_setriskparameters)
* [\_setOriginationFee\(uint256 originationFeeMantissa\)](moneymarket.md#_setoriginationfee)
* [\_setMarketInterestRateModel\(address asset, InterestRateModel interestRateModel\)](moneymarket.md#_setmarketinterestratemodel)
* [\_withdrawEquity\(address asset, uint256 amount\)](moneymarket.md#_withdrawequity)
* [setWethAddress\(address wethContractAddress\)](moneymarket.md#setwethaddress)
* [supplyEther\(address user, uint256 etherAmount\)](moneymarket.md#supplyether)
* [revertEtherToUser\(address user, uint256 etherAmount\)](moneymarket.md#revertethertouser)
* [supply\(address asset, uint256 amount\)](moneymarket.md#supply)
* [withdrawEther\(address user, uint256 etherAmount\)](moneymarket.md#withdrawether)
* [sendEtherToUser\(address user, uint256 amount\)](moneymarket.md#sendethertouser)
* [withdraw\(address asset, uint256 requestedAmount\)](moneymarket.md#withdraw)
* [calculateAccountLiquidity\(address userAddress\)](moneymarket.md#calculateaccountliquidity)
* [calculateAccountValuesInternal\(address userAddress\)](moneymarket.md#calculateaccountvaluesinternal)
* [calculateAccountValues\(address userAddress\)](moneymarket.md#calculateaccountvalues)
* [repayBorrow\(address asset, uint256 amount\)](moneymarket.md#repayborrow)
* [liquidateBorrow\(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose\)](moneymarket.md#liquidateborrow)
* [emitLiquidationEvent\(struct MoneyMarket.LiquidateLocalVars localResults\)](moneymarket.md#emitliquidationevent)
* [calculateDiscountedRepayToEvenAmount\(address targetAccount, struct Exponential.Exp underwaterAssetPrice\)](moneymarket.md#calculatediscountedrepaytoevenamount)
* [calculateDiscountedBorrowDenominatedCollateral\(struct Exponential.Exp underwaterAssetPrice, struct Exponential.Exp collateralPrice, uint256 supplyCurrent\_TargetCollateralAsset\)](moneymarket.md#calculatediscountedborrowdenominatedcollateral)
* [calculateAmountSeize\(struct Exponential.Exp underwaterAssetPrice, struct Exponential.Exp collateralPrice, uint256 closeBorrowAmount\_TargetUnderwaterAsset\)](moneymarket.md#calculateamountseize)
* [borrow\(address asset, uint256 amount\)](moneymarket.md#borrow)
* [supplyOriginationFeeAsAdmin\(address asset, address user, uint256 amount, uint256 newSupplyIndex\)](moneymarket.md#supplyoriginationfeeasadmin)

### initializer

`MoneyMarket` is the core MoneyMarket contract

```javascript
function initializer() public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


Do not pay directly into MoneyMarket, please use `supply`.

```javascript
function () public payable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### emitError

Function to emit fail event to frontend

```javascript
function emitError(enum ErrorReporter.Error error, enum ErrorReporter.FailureInfo failure) private nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| error | enum ErrorReporter.Error |  |
| failure | enum ErrorReporter.FailureInfo |  |

### addKYCAdmin

Function for use by the admin of the contract to add KYC Admins

```javascript
function addKYCAdmin(address KYCAdmin) public nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| KYCAdmin | address |  |

### removeKYCAdmin

Function for use by the admin of the contract to remove KYC Admins

```javascript
function removeKYCAdmin(address KYCAdmin) public nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| KYCAdmin | address |  |

### addCustomerKYC

Function for use by the KYC admins to add KYC Customers

```javascript
function addCustomerKYC(address customer) public nonpayable isKYCAdmin 
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| customer | address |  |

### removeCustomerKYC

Function for use by the KYC admins to remove KYC Customers

```javascript
function removeCustomerKYC(address customer) public nonpayable isKYCAdmin 
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| customer | address |  |

### verifyKYC

Function to fetch KYC verification status of a customer

```javascript
function verifyKYC(address customer) public view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| customer | address |  |

### checkKYCAdmin

Function to fetch KYC Admin status of an admin

```javascript
function checkKYCAdmin(address _KYCAdmin) public view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_KYCAdmin | address |  |

### addLiquidator

Function for use by the admin of the contract to add Liquidators

```javascript
function addLiquidator(address liquidator) public nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| liquidator | address |  |

### removeLiquidator

Function for use by the admin of the contract to remove Liquidators

```javascript
function removeLiquidator(address liquidator) public nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| liquidator | address |  |

### verifyLiquidator

Function to fetch Liquidator status of a customer

```javascript
function verifyLiquidator(address liquidator) public view
returns(bool)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| liquidator | address |  |

### min

Simple function to calculate min between two numbers.

```javascript
function min(uint256 a, uint256 b) internal pure
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| a | uint256 |  |
| b | uint256 |  |

### getBlockNumber

Function to simply retrieve block number This exists mainly for inheriting test contracts to stub this result.

```javascript
function getBlockNumber() internal view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### addCollateralMarket

Adds a given asset to the list of collateral markets. This operation is impossible to reverse. Note: this will not add the asset if it already exists.

```javascript
function addCollateralMarket(address asset) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |

### getCollateralMarketsLength

return the number of elements in `collateralMarkets`

```javascript
function getCollateralMarketsLength() public view
returns(uint256)
```

**Returns**

the length of `collateralMarkets`

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### calculateInterestIndex

Calculates a new supply index based on the prevailing interest rates applied over time This is defined as `we multiply the most recent supply index by (1 + blocks times rate)`

```javascript
function calculateInterestIndex(uint256 startingInterestIndex, uint256 interestRateMantissa, uint256 blockStart, uint256 blockEnd) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| startingInterestIndex | uint256 |  |
| interestRateMantissa | uint256 |  |
| blockStart | uint256 |  |
| blockEnd | uint256 |  |

### calculateBalance

Calculates a new balance based on a previous balance and a pair of interest indices This is defined as: `The user's last balance checkpoint is multiplied by the currentSupplyIndex value and divided by the user's checkpoint index value`

* TODO: Is there a way to handle this that is less likely to overflow?

```javascript
function calculateBalance(uint256 startingBalance, uint256 interestIndexStart, uint256 interestIndexEnd) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| startingBalance | uint256 |  |
| interestIndexStart | uint256 |  |
| interestIndexEnd | uint256 |  |

### getPriceForAssetAmount

Gets the price for the amount specified of the given asset.

```javascript
function getPriceForAssetAmount(address asset, uint256 assetAmount) internal view
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| assetAmount | uint256 |  |

### getPriceForAssetAmountMulCollatRatio

Gets the price for the amount specified of the given asset multiplied by the current collateral ratio \(i.e., assetAmountWei  _collateralRatio_  oraclePrice = totalValueInEth\). We will group this as `(oraclePrice * collateralRatio) * assetAmountWei`

```javascript
function getPriceForAssetAmountMulCollatRatio(address asset, uint256 assetAmount) internal view
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| assetAmount | uint256 |  |

### calculateBorrowAmountWithFee

Calculates the origination fee added to a given borrowAmount This is simply `(1 + originationFee) * borrowAmount`

* TODO: Track at what magnitude this fee rounds down to zero?

```javascript
function calculateBorrowAmountWithFee(uint256 borrowAmount) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| borrowAmount | uint256 |  |

### fetchAssetPrice

fetches the price of asset from the PriceOracle and converts it to Exp

```javascript
function fetchAssetPrice(address asset) internal view
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | asset whose price should be fetched |

### assetPrices

Reads scaled price of specified asset from the price oracle

```javascript
function assetPrices(address asset) public view
returns(uint256)
```

**Returns**

0 on an error or missing price, the price scaled by 1e18 otherwise

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset whose price should be retrieved |

### getAssetAmountForValue

Gets the amount of the specified asset given the specified Eth value ethValue / oraclePrice = assetAmountWei If there's no oraclePrice, this returns \(Error.DIVISION\_BY\_ZERO, 0\)

```javascript
function getAssetAmountForValue(address asset, struct Exponential.Exp ethValue) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| ethValue | struct Exponential.Exp |  |

### \_setPendingAdmin

Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.

```javascript
function _setPendingAdmin(address newPendingAdmin) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

* TODO: Should we add a second arg to verify, like a checksum of `newAdmin` address?

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| newPendingAdmin | address | New pending admin. |

### \_acceptAdmin

Accepts transfer of admin rights. msg.sender must be pendingAdmin

```javascript
function _acceptAdmin() public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### \_setOracle

Set new oracle, who can set asset prices

```javascript
function _setOracle(address newOracle) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| newOracle | address | New oracle address |

### \_setPaused

set `paused` to the specified state

```javascript
function _setPaused(bool requestedState) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| requestedState | bool | value to assign to `paused` |

### getAccountLiquidity

returns the liquidity for given account. a positive result indicates ability to borrow, whereas a negative result indicates a shortfall which may be liquidated

```javascript
function getAccountLiquidity(address account) public view
returns(int256)
```

**Returns**

signed integer in terms of eth-wei \(negative indicates a shortfall\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| account | address | the account to examine |

### getSupplyBalance

return supply balance with any accumulated interest for `asset` belonging to `account`

```javascript
function getSupplyBalance(address account, address asset) public view
returns(uint256)
```

**Returns**

uint supply balance on success, throws on failed assertion otherwise

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| account | address | the account to examine |
| asset | address | the market asset whose supply balance belonging to `account` should be checked |

### getBorrowBalance

return borrow balance with any accumulated interest for `asset` belonging to `account`

```javascript
function getBorrowBalance(address account, address asset) public view
returns(uint256)
```

**Returns**

uint borrow balance on success, throws on failed assertion otherwise

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| account | address | the account to examine |
| asset | address | the market asset whose borrow balance belonging to `account` should be checked |

### \_supportMarket

Supports a given market \(asset\) for use

```javascript
function _supportMarket(address asset, InterestRateModel interestRateModel) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset to support; MUST already have a non-zero price set |
| interestRateModel | InterestRateModel | InterestRateModel to use for the asset |

### \_suspendMarket

Suspends a given _supported_ market \(asset\) from use. Assets in this state do count for collateral, but users may only withdraw, payBorrow, and liquidate the asset. The liquidate function no longer checks collateralization.

```javascript
function _suspendMarket(address asset) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset to suspend |

### \_setRiskParameters

Sets the risk parameters: collateral ratio and liquidation discount

```javascript
function _setRiskParameters(uint256 collateralRatioMantissa, uint256 liquidationDiscountMantissa, uint256 _minimumCollateralRatioMantissa, uint256 _maximumLiquidationDiscountMantissa) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| collateralRatioMantissa | uint256 | rational collateral ratio, scaled by 1e18. The de-scaled value must be &gt;= 1.1 |
| liquidationDiscountMantissa | uint256 | rational liquidation discount, scaled by 1e18. The de-scaled value must be &lt;= 0.1 and must be less than \(descaled collateral ratio minus 1\) |
| \_minimumCollateralRatioMantissa | uint256 |  |
| \_maximumLiquidationDiscountMantissa | uint256 |  |

### \_setOriginationFee

Sets the origination fee \(which is a multiplier on new borrows\)

```javascript
function _setOriginationFee(uint256 originationFeeMantissa) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| originationFeeMantissa | uint256 | rational collateral ratio, scaled by 1e18. The de-scaled value must be &gt;= 1.1 |

### \_setMarketInterestRateModel

Sets the interest rate model for a given market

```javascript
function _setMarketInterestRateModel(address asset, InterestRateModel interestRateModel) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset to support |
| interestRateModel | InterestRateModel |  |

### \_withdrawEquity

withdraws `amount` of `asset` from equity for asset, as long as `amount` &lt;= equity. Equity= cash - \(supply + borrows\)

```javascript
function _withdrawEquity(address asset, uint256 amount) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | asset whose equity should be withdrawn |
| amount | uint256 | amount of equity to withdraw; must not exceed equity available |

### setWethAddress

Set WETH token contract address

```javascript
function setWethAddress(address wethContractAddress) public nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| wethContractAddress | address | Enter the WETH token address |

### supplyEther

Convert Ether supplied by user into WETH tokens and then supply corresponding WETH to user

```javascript
function supplyEther(address user, uint256 etherAmount) internal nonpayable
returns(uint256)
```

**Returns**

errors if any

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| user | address | User account address |
| etherAmount | uint256 | Amount of ether to be converted to WETH |

### revertEtherToUser

Revert Ether paid by user back to user's account in case transaction fails due to some other reason

```javascript
function revertEtherToUser(address user, uint256 etherAmount) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| user | address | User account address |
| etherAmount | uint256 | Amount of ether to be sent back to user |

### supply

supply `amount` of `asset` \(which must be supported\) to `msg.sender` in the protocol

```javascript
function supply(address asset, uint256 amount) public payable isKYCVerifiedCustomer 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to supply |
| amount | uint256 | The amount to supply |

### withdrawEther

withdraw `amount` of `ether` from sender's account to sender's address

```javascript
function withdrawEther(address user, uint256 etherAmount) internal nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| user | address | User account address |
| etherAmount | uint256 | Amount of ether to be converted to WETH |

### sendEtherToUser

send Ether from contract to a user

```javascript
function sendEtherToUser(address user, uint256 amount) public nonpayable
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| user | address |  |
| amount | uint256 |  |

### withdraw

withdraw `amount` of `asset` from sender's account to sender's address

```javascript
function withdraw(address asset, uint256 requestedAmount) public nonpayable isKYCVerifiedCustomer 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to withdraw |
| requestedAmount | uint256 | The amount to withdraw \(or -1 for max\) |

### calculateAccountLiquidity

Gets the user's account liquidity and account shortfall balances. This includes any accumulated interest thus far but does NOT actually update anything in storage, it simply calculates the account liquidity and shortfall with liquidity being returned as the first Exp, ie \(Error, accountLiquidity, accountShortfall\).

```javascript
function calculateAccountLiquidity(address userAddress) internal view
returns(enum ErrorReporter.Error, struct Exponential.Exp, struct Exponential.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| userAddress | address |  |

### calculateAccountValuesInternal

Gets the ETH values of the user's accumulated supply and borrow balances, scaled by 10e18. This includes any accumulated interest thus far but does NOT actually update anything in storage

```javascript
function calculateAccountValuesInternal(address userAddress) internal view
returns(enum ErrorReporter.Error, uint256, uint256)
```

**Returns**

\(error code, sum ETH value of supplies scaled by 10e18, sum ETH value of borrows scaled by 10e18\) TODO: Possibly should add a Min\(500, collateralMarkets.length\) for extra safety TODO: To help save gas we could think about using the current Market.interestIndex accumulate interest rather than calculating it

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| userAddress | address | account for which to sum values |

### calculateAccountValues

Gets the ETH values of the user's accumulated supply and borrow balances, scaled by 10e18. This includes any accumulated interest thus far but does NOT actually update anything in storage

```javascript
function calculateAccountValues(address userAddress) public view
returns(uint256, uint256, uint256)
```

**Returns**

\(uint 0=success; otherwise a failure \(see ErrorReporter.sol for details\), sum ETH value of supplies scaled by 10e18, sum ETH value of borrows scaled by 10e18\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| userAddress | address | account for which to sum values |

### repayBorrow

Users repay borrowed assets from their own address to the protocol.

```javascript
function repayBorrow(address asset, uint256 amount) public payable isKYCVerifiedCustomer 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to repay |
| amount | uint256 | The amount to repay \(or -1 for max\) |

### liquidateBorrow

users repay all or some of an underwater borrow and receive collateral

```javascript
function liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose) public nonpayable isKYCVerifiedCustomer isLiquidator 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| targetAccount | address | The account whose borrow should be liquidated |
| assetBorrow | address | The market asset to repay |
| assetCollateral | address | The borrower's market asset to receive in exchange |
| requestedAmountClose | uint256 | The amount to repay \(or -1 for max\) |

### emitLiquidationEvent

this function exists to avoid error `CompilerError: Stack too deep, try removing local variables.` in `liquidateBorrow`

```javascript
function emitLiquidationEvent(struct MoneyMarket.LiquidateLocalVars localResults) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| localResults | struct MoneyMarket.LiquidateLocalVars |  |

### calculateDiscountedRepayToEvenAmount

This should ONLY be called if market is supported. It returns shortfall / \[Oracle price for the borrow \* \(collateralRatio - liquidationDiscount - 1\)\] If the market isn't supported, we support liquidation of asset regardless of shortfall because we want borrows of the unsupported asset to be closed. Note that if collateralRatio = liquidationDiscount + 1, then the denominator will be zero and the function will fail with DIVISION\_BY\_ZERO.

```javascript
function calculateDiscountedRepayToEvenAmount(address targetAccount, struct Exponential.Exp underwaterAssetPrice) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| targetAccount | address |  |
| underwaterAssetPrice | struct Exponential.Exp |  |

### calculateDiscountedBorrowDenominatedCollateral

discountedBorrowDenominatedCollateral = \[supplyCurrent / \(1 + liquidationDiscount\)\] \* \(Oracle price for the collateral / Oracle price for the borrow\)

```javascript
function calculateDiscountedBorrowDenominatedCollateral(struct Exponential.Exp underwaterAssetPrice, struct Exponential.Exp collateralPrice, uint256 supplyCurrent_TargetCollateralAsset) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| underwaterAssetPrice | struct Exponential.Exp |  |
| collateralPrice | struct Exponential.Exp |  |
| supplyCurrent\_TargetCollateralAsset | uint256 |  |

### calculateAmountSeize

returns closeBorrowAmount\_TargetUnderwaterAsset  _\(1+liquidationDiscount\)_  priceBorrow/priceCollateral

```javascript
function calculateAmountSeize(struct Exponential.Exp underwaterAssetPrice, struct Exponential.Exp collateralPrice, uint256 closeBorrowAmount_TargetUnderwaterAsset) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| underwaterAssetPrice | struct Exponential.Exp |  |
| collateralPrice | struct Exponential.Exp |  |
| closeBorrowAmount\_TargetUnderwaterAsset | uint256 |  |

### borrow

Users borrow assets from the protocol to their own address

```javascript
function borrow(address asset, uint256 amount) public nonpayable isKYCVerifiedCustomer 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to borrow |
| amount | uint256 | The amount to borrow |

### supplyOriginationFeeAsAdmin

```javascript
function supplyOriginationFeeAsAdmin(address asset, address user, uint256 amount, uint256 newSupplyIndex) private nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| user | address |  |
| amount | uint256 |  |
| newSupplyIndex | uint256 |  |

