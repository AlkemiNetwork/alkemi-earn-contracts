---
layout: default
title: AlkemiEarnVerified
---

# AlkemiEarnVerified.sol

View Source: [contracts/AlkemiEarnVerified.sol](../contracts/AlkemiEarnVerified.sol)

**↗ Extends:** [**Exponential**](Exponential.md)**,** [**SafeToken**](SafeToken.md)

### Structs

#### Balance

```javascript
struct Balance {
 uint256 principal,
 uint256 interestIndex
}
```

#### Market

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

#### SupplyLocalVars

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

#### WithdrawLocalVars

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
 uint256 withdrawCapacity,
 struct Exponential.Exp accountLiquidity,
 struct Exponential.Exp accountShortfall,
 struct Exponential.Exp ethValueOfWithdrawal
}
```

#### AccountValueLocalVars

```javascript
struct AccountValueLocalVars {
 address assetAddress,
 uint256 collateralMarketsLength,
 uint256 newSupplyIndex,
 uint256 userSupplyCurrent,
 uint256 newBorrowIndex,
 uint256 userBorrowCurrent,
 struct Exponential.Exp borrowTotalValue,
 struct Exponential.Exp sumBorrows,
 struct Exponential.Exp supplyTotalValue,
 struct Exponential.Exp sumSupplies
}
```

#### PayBorrowLocalVars

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

#### BorrowLocalVars

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

#### LiquidateLocalVars

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
 uint256 reimburseAmount,
 struct Exponential.Exp collateralPrice,
 struct Exponential.Exp underwaterAssetPrice
}
```

### Contract Members

**Constants & Variables**

```javascript
//internal members
uint256 internal initialInterestIndex;
uint256 internal defaultOriginationFee;
uint256 internal defaultCollateralRatio;
uint256 internal defaultLiquidationDiscount;

//public members
uint256 public minimumCollateralRatioMantissa;
uint256 public maximumLiquidationDiscountMantissa;
address public pendingAdmin;
address public admin;
mapping(address => bool) public managers;
contract ChainLink public priceOracle;
mapping(address => mapping(address => struct AlkemiEarnVerified.Balance)) public supplyBalances;
mapping(address => mapping(address => struct AlkemiEarnVerified.Balance)) public borrowBalances;
contract AlkemiWETH public WETHContract;
mapping(address => struct AlkemiEarnVerified.Market) public markets;
address[] public collateralMarkets;
struct Exponential.Exp public collateralRatio;
struct Exponential.Exp public originationFee;
struct Exponential.Exp public liquidationDiscount;
bool public paused;
mapping(address => bool) public KYCAdmins;
mapping(address => bool) public customersWithKYC;
mapping(address => bool) public liquidators;
mapping(address => mapping(address => uint256)) public originationFeeBalance;
contract RewardControlInterface public rewardControl;
uint256 public closeFactorMantissa;
uint256 public _guardCounter;

//private members
bool private initializationDone;
address private oracle;
address private wethAddress;
```

**Events**

```javascript
event LiquidatorChanged(address indexed Liquidator, bool  newStatus);
event SupplyReceived(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  newBalance);
event SupplyWithdrawn(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  newBalance);
event BorrowTaken(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  borrowAmountWithFee, uint256  newBalance);
event BorrowRepaid(address  account, address  asset, uint256  amount, uint256  startingBalance, uint256  newBalance);
event BorrowLiquidated(address indexed targetAccount, address  assetBorrow, uint256  borrowBalanceAccumulated, uint256  amountRepaid, address indexed liquidator, address  assetCollateral, uint256  amountSeized);
event EquityWithdrawn(address indexed asset, uint256  equityAvailableBefore, uint256  amount, address indexed owner);
event KYCAdminChanged(address indexed KYCAdmin, bool  newStatus);
event KYCCustomerChanged(address indexed KYCCustomer, bool  newStatus);
```

### Modifiers

* onlyOwner
* onlyCustomerWithKYC
* nonReentrant

#### onlyOwner

Modifier to check if the caller is the admin of the contract

```javascript
modifier onlyOwner() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### onlyCustomerWithKYC

Modifier to check if the caller is KYC verified

```javascript
modifier onlyCustomerWithKYC() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### nonReentrant

Prevents a contract from calling itself, directly or indirectly. If you mark a function `nonReentrant`, you should also mark it `external`. Calling one `nonReentrant` function from another is not supported. Instead, you can implement a `private` function doing the actual work, and an `external` wrapper marked as `nonReentrant`.

```javascript
modifier nonReentrant() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### Functions

* initializer\(\)
* \(\)
* \_changeKYCAdmin\(address KYCAdmin, bool newStatus\)
* \_changeCustomerKYC\(address customer, bool newStatus\)
* \_changeLiquidator\(address liquidator, bool newStatus\)
* min\(uint256 a, uint256 b\)
* addCollateralMarket\(address asset\)
* calculateInterestIndex\(uint256 startingInterestIndex, uint256 interestRateMantissa, uint256 blockStart, uint256 blockEnd\)
* calculateBalance\(uint256 startingBalance, uint256 interestIndexStart, uint256 interestIndexEnd\)
* getPriceForAssetAmount\(address asset, uint256 assetAmount, bool mulCollatRatio\)
* calculateBorrowAmountWithFee\(uint256 borrowAmount\)
* fetchAssetPrice\(address asset\)
* assetPrices\(address asset\)
* getAssetAmountForValue\(address asset, struct Exponential.Exp ethValue\)
* \_adminFunctions\(address newPendingAdmin, address newOracle, bool requestedState, uint256 originationFeeMantissa, uint256 newCloseFactorMantissa, address wethContractAddress, address \_rewardControl\)
* \_acceptAdmin\(\)
* getAccountLiquidity\(address account\)
* getSupplyBalance\(address account, address asset\)
* getBorrowBalance\(address account, address asset\)
* \_supportMarket\(address asset, InterestRateModel interestRateModel\)
* \_suspendMarket\(address asset\)
* \_setRiskParameters\(uint256 collateralRatioMantissa, uint256 liquidationDiscountMantissa\)
* \_setMarketInterestRateModel\(address asset, InterestRateModel interestRateModel\)
* \_withdrawEquity\(address asset, uint256 amount\)
* supplyEther\(uint256 etherAmount\)
* revertEtherToUser\(address user, uint256 etherAmount\)
* supply\(address asset, uint256 amount\)
* withdrawEther\(address user, uint256 etherAmount\)
* withdraw\(address asset, uint256 requestedAmount\)
* calculateAccountLiquidity\(address userAddress\)
* calculateAccountValuesInternal\(address userAddress\)
* calculateAccountValues\(address userAddress\)
* repayBorrow\(address asset, uint256 amount\)
* liquidateBorrow\(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose\)
* calculateDiscountedRepayToEvenAmount\(address targetAccount, struct Exponential.Exp underwaterAssetPrice, address assetBorrow\)
* calculateDiscountedBorrowDenominatedCollateral\(struct Exponential.Exp underwaterAssetPrice, struct Exponential.Exp collateralPrice, uint256 supplyCurrent\_TargetCollateralAsset\)
* calculateAmountSeize\(struct Exponential.Exp underwaterAssetPrice, struct Exponential.Exp collateralPrice, uint256 closeBorrowAmount\_TargetUnderwaterAsset\)
* borrow\(address asset, uint256 amount\)
* supplyOriginationFeeAsAdmin\(address asset, address user, uint256 amount, uint256 newSupplyIndex\)
* refreshAlkIndex\(address market, address user, bool isSupply, bool isVerified\)
* getMarketBalances\(address asset\)
* revertIfError\(enum ErrorReporter.Error err\)

#### initializer

`AlkemiEarnVerified` is the core contract

```javascript
function initializer() public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### 

Do not pay directly into AlkemiEarnVerified, please use `supply`.

```javascript
function () public payable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### \_changeKYCAdmin

Function for use by the admin of the contract to add or remove KYC Admins

```javascript
function _changeKYCAdmin(address KYCAdmin, bool newStatus) public nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| KYCAdmin | address |  |
| newStatus | bool |  |

#### \_changeCustomerKYC

Function for use by the KYC admins to add or remove KYC Customers

```javascript
function _changeCustomerKYC(address customer, bool newStatus) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| customer | address |  |
| newStatus | bool |  |

#### \_changeLiquidator

Function for use by the admin of the contract to add or remove Liquidators

```javascript
function _changeLiquidator(address liquidator, bool newStatus) public nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| liquidator | address |  |
| newStatus | bool |  |

#### min

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

#### addCollateralMarket

Adds a given asset to the list of collateral markets. This operation is impossible to reverse. Note: this will not add the asset if it already exists.

```javascript
function addCollateralMarket(address asset) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |

#### calculateInterestIndex

Calculates a new supply index based on the prevailing interest rates applied over time This is defined as `we multiply the most recent supply index by (1 + blocks times rate)`

```javascript
function calculateInterestIndex(uint256 startingInterestIndex, uint256 interestRateMantissa, uint256 blockStart, uint256 blockEnd) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Returns**

Return value is expressed in 1e18 scale

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| startingInterestIndex | uint256 |  |
| interestRateMantissa | uint256 |  |
| blockStart | uint256 |  |
| blockEnd | uint256 |  |

#### calculateBalance

Calculates a new balance based on a previous balance and a pair of interest indices This is defined as: `The user's last balance checkpoint is multiplied by the currentSupplyIndex value and divided by the user's checkpoint index value`

```javascript
function calculateBalance(uint256 startingBalance, uint256 interestIndexStart, uint256 interestIndexEnd) internal pure
returns(enum ErrorReporter.Error, uint256)
```

**Returns**

Return value is expressed in 1e18 scale

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| startingBalance | uint256 |  |
| interestIndexStart | uint256 |  |
| interestIndexEnd | uint256 |  |

#### getPriceForAssetAmount

Gets the price for the amount specified of the given asset.

```javascript
function getPriceForAssetAmount(address asset, uint256 assetAmount, bool mulCollatRatio) internal view
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Returns**

Return value is expressed in a magnified scale per token decimals

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| assetAmount | uint256 |  |
| mulCollatRatio | bool |  |

#### calculateBorrowAmountWithFee

Calculates the origination fee added to a given borrowAmount This is simply `(1 + originationFee) * borrowAmount`

```javascript
function calculateBorrowAmountWithFee(uint256 borrowAmount) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Returns**

Return value is expressed in 1e18 scale

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| borrowAmount | uint256 |  |

#### fetchAssetPrice

fetches the price of asset from the PriceOracle and converts it to Exp

```javascript
function fetchAssetPrice(address asset) internal view
returns(enum ErrorReporter.Error, struct Exponential.Exp)
```

**Returns**

Return value is expressed in a magnified scale per token decimals

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | asset whose price should be fetched |

#### assetPrices

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

#### getAssetAmountForValue

Gets the amount of the specified asset given the specified Eth value ethValue / oraclePrice = assetAmountWei If there's no oraclePrice, this returns \(Error.DIVISION\_BY\_ZERO, 0\)

```javascript
function getAssetAmountForValue(address asset, struct Exponential.Exp ethValue) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Returns**

Return value is expressed in a magnified scale per token decimals

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address |  |
| ethValue | struct Exponential.Exp |  |

#### \_adminFunctions

Admin Functions. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.

```javascript
function _adminFunctions(address newPendingAdmin, address newOracle, bool requestedState, uint256 originationFeeMantissa, uint256 newCloseFactorMantissa, address wethContractAddress, address _rewardControl) public nonpayable onlyOwner 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| newPendingAdmin | address | New pending admin |
| newOracle | address | New oracle address |
| requestedState | bool | value to assign to `paused` |
| originationFeeMantissa | uint256 | rational collateral ratio, scaled by 1e18. |
| newCloseFactorMantissa | uint256 | new Close Factor, scaled by 1e18 |
| wethContractAddress | address | WETH Contract Address |
| \_rewardControl | address | Reward Control Address |

#### \_acceptAdmin

Accepts transfer of admin rights. msg.sender must be pendingAdmin

```javascript
function _acceptAdmin() public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### getAccountLiquidity

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

#### getSupplyBalance

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

#### getBorrowBalance

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

#### \_supportMarket

Supports a given market \(asset\) for use

```javascript
function _supportMarket(address asset, InterestRateModel interestRateModel) public nonpayable onlyOwner 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset to support; MUST already have a non-zero price set |
| interestRateModel | InterestRateModel | InterestRateModel to use for the asset |

#### \_suspendMarket

Suspends a given _supported_ market \(asset\) from use. Assets in this state do count for collateral, but users may only withdraw, payBorrow, and liquidate the asset. The liquidate function no longer checks collateralization.

```javascript
function _suspendMarket(address asset) public nonpayable onlyOwner 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset to suspend |

#### \_setRiskParameters

Sets the risk parameters: collateral ratio and liquidation discount

```javascript
function _setRiskParameters(uint256 collateralRatioMantissa, uint256 liquidationDiscountMantissa) public nonpayable onlyOwner 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| collateralRatioMantissa | uint256 | rational collateral ratio, scaled by 1e18. The de-scaled value must be &gt;= 1.1 |
| liquidationDiscountMantissa | uint256 | rational liquidation discount, scaled by 1e18. The de-scaled value must be &lt;= 0.1 and must be less than \(descaled collateral ratio minus 1\) |

#### \_setMarketInterestRateModel

Sets the interest rate model for a given market

```javascript
function _setMarketInterestRateModel(address asset, InterestRateModel interestRateModel) public nonpayable onlyOwner 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | Asset to support |
| interestRateModel | InterestRateModel |  |

#### \_withdrawEquity

withdraws `amount` of `asset` from equity for asset, as long as `amount` &lt;= equity. Equity = cash + borrows - supply

```javascript
function _withdrawEquity(address asset, uint256 amount) public nonpayable onlyOwner 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | asset whose equity should be withdrawn |
| amount | uint256 | amount of equity to withdraw; must not exceed equity available |

#### supplyEther

Convert Ether supplied by user into WETH tokens and then supply corresponding WETH to user

```javascript
function supplyEther(uint256 etherAmount) internal nonpayable
returns(uint256)
```

**Returns**

errors if any

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| etherAmount | uint256 | Amount of ether to be converted to WETH |

#### revertEtherToUser

Revert Ether paid by user back to user's account in case transaction fails due to some other reason

```javascript
function revertEtherToUser(address user, uint256 etherAmount) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| user | address | User account address |
| etherAmount | uint256 | Amount of ether to be sent back to user |

#### supply

supply `amount` of `asset` \(which must be supported\) to `msg.sender` in the protocol

```javascript
function supply(address asset, uint256 amount) public payable nonReentrant onlyCustomerWithKYC 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to supply |
| amount | uint256 | The amount to supply |

#### withdrawEther

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

#### withdraw

withdraw `amount` of `asset` from sender's account to sender's address

```javascript
function withdraw(address asset, uint256 requestedAmount) public nonpayable nonReentrant 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to withdraw |
| requestedAmount | uint256 | The amount to withdraw \(or -1 for max\) |

#### calculateAccountLiquidity

Gets the user's account liquidity and account shortfall balances. This includes any accumulated interest thus far but does NOT actually update anything in storage, it simply calculates the account liquidity and shortfall with liquidity being returned as the first Exp, ie \(Error, accountLiquidity, accountShortfall\).

```javascript
function calculateAccountLiquidity(address userAddress) internal view
returns(enum ErrorReporter.Error, struct Exponential.Exp, struct Exponential.Exp)
```

**Returns**

Return values are expressed in 1e18 scale

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| userAddress | address |  |

#### calculateAccountValuesInternal

Gets the ETH values of the user's accumulated supply and borrow balances, scaled by 10e18. This includes any accumulated interest thus far but does NOT actually update anything in storage

```javascript
function calculateAccountValuesInternal(address userAddress) internal view
returns(enum ErrorReporter.Error, struct Exponential.Exp, struct Exponential.Exp)
```

**Returns**

\(error code, sum ETH value of supplies scaled by 10e18, sum ETH value of borrows scaled by 10e18\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| userAddress | address | account for which to sum values |

#### calculateAccountValues

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

#### repayBorrow

Users repay borrowed assets from their own address to the protocol.

```javascript
function repayBorrow(address asset, uint256 amount) public payable nonReentrant 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to repay |
| amount | uint256 | The amount to repay \(or -1 for max\) |

#### liquidateBorrow

users repay all or some of an underwater borrow and receive collateral

```javascript
function liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose) public payable
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

#### calculateDiscountedRepayToEvenAmount

This should ONLY be called if market is supported. It returns shortfall / \[Oracle price for the borrow \* \(collateralRatio - liquidationDiscount - 1\)\] If the market isn't supported, we support liquidation of asset regardless of shortfall because we want borrows of the unsupported asset to be closed. Note that if collateralRatio = liquidationDiscount + 1, then the denominator will be zero and the function will fail with DIVISION\_BY\_ZERO.

```javascript
function calculateDiscountedRepayToEvenAmount(address targetAccount, struct Exponential.Exp underwaterAssetPrice, address assetBorrow) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Returns**

Return values are expressed in 1e18 scale

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| targetAccount | address |  |
| underwaterAssetPrice | struct Exponential.Exp |  |
| assetBorrow | address |  |

#### calculateDiscountedBorrowDenominatedCollateral

discountedBorrowDenominatedCollateral = \[supplyCurrent / \(1 + liquidationDiscount\)\] \* \(Oracle price for the collateral / Oracle price for the borrow\)

```javascript
function calculateDiscountedBorrowDenominatedCollateral(struct Exponential.Exp underwaterAssetPrice, struct Exponential.Exp collateralPrice, uint256 supplyCurrent_TargetCollateralAsset) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Returns**

Return values are expressed in 1e18 scale

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| underwaterAssetPrice | struct Exponential.Exp |  |
| collateralPrice | struct Exponential.Exp |  |
| supplyCurrent\_TargetCollateralAsset | uint256 |  |

#### calculateAmountSeize

returns closeBorrowAmount\_TargetUnderwaterAsset  _\(1+liquidationDiscount\)_  priceBorrow/priceCollateral

```javascript
function calculateAmountSeize(struct Exponential.Exp underwaterAssetPrice, struct Exponential.Exp collateralPrice, uint256 closeBorrowAmount_TargetUnderwaterAsset) internal view
returns(enum ErrorReporter.Error, uint256)
```

**Returns**

Return values are expressed in 1e18 scale

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| underwaterAssetPrice | struct Exponential.Exp |  |
| collateralPrice | struct Exponential.Exp |  |
| closeBorrowAmount\_TargetUnderwaterAsset | uint256 |  |

#### borrow

Users borrow assets from the protocol to their own address

```javascript
function borrow(address asset, uint256 amount) public nonpayable nonReentrant onlyCustomerWithKYC 
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to borrow |
| amount | uint256 | The amount to borrow |

#### supplyOriginationFeeAsAdmin

supply `amount` of `asset` \(which must be supported\) to `admin` in the protocol

```javascript
function supplyOriginationFeeAsAdmin(address asset, address user, uint256 amount, uint256 newSupplyIndex) private nonpayable
```

**Returns**

uint 0=success, otherwise a failure \(see ErrorReporter.sol for details\)

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to supply |
| user | address |  |
| amount | uint256 | The amount to supply |
| newSupplyIndex | uint256 |  |

#### refreshAlkIndex

Trigger the underlying Reward Control contract to accrue ALK supply rewards for the supplier on the specified market

```javascript
function refreshAlkIndex(address market, address user, bool isSupply, bool isVerified) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The address of the market to accrue rewards |
| user | address | The address of the supplier/borrower to accrue rewards |
| isSupply | bool | Specifies if Supply or Borrow Index need to be updated |
| isVerified | bool | Verified / Public protocol |

#### getMarketBalances

Get supply and borrows for a market

```javascript
function getMarketBalances(address asset) public view
returns(uint256, uint256)
```

**Returns**

updated supply and borrows

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| asset | address | The market asset to find balances of |

#### revertIfError

Function to revert in case of an internal exception

```javascript
function revertIfError(enum ErrorReporter.Error err) internal pure
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| err | enum ErrorReporter.Error |  |

