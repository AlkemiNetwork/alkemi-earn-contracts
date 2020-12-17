# LiquidationChecker.sol

View Source: [contracts/Liquidator.sol](../contracts/Liquidator.sol)

**↗ Extends: [ErrorReporter](ErrorReporter.md), [SafeToken](SafeToken.md)**
**↘ Derived Contracts: [AlkemiRateModel](AlkemiRateModel.md)**

**LiquidationChecker**

## Structs
### Market

```js
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

## Contract Members
**Constants & Variables**

```js
mapping(address => struct MoneyMarket.Market) public markets;
contract MoneyMarket public moneyMarket;

```

**Events**

```js
event BorrowLiquidated(address  targetAccount, address  assetBorrow, uint256  borrowBalanceBefore, uint256  borrowBalanceAccumulated, uint256  amountRepaid, uint256  borrowBalanceAfter, address  liquidator, address  assetCollateral, uint256  collateralBalanceBefore, uint256  collateralBalanceAccumulated, uint256  amountSeized, uint256  collateralBalanceAfter);
```

## Functions

- [setAllowLiquidation(bool allowLiquidation_)](#setallowliquidation)
- [liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose)](#liquidateborrow)
- [withdraw(address asset, uint256 requestedAmount)](#withdraw)
- [getSupplyBalance(address account, address asset)](#getsupplybalance)
- [getBorrowBalance(address account, address asset)](#getborrowbalance)
- [liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose)](#liquidateborrow)
- [tokenAllowAll(address asset, address allowee)](#tokenallowall)
- [tokenTransferAll(address asset, address recipient)](#tokentransferall)

### setAllowLiquidation

```js
function setAllowLiquidation(bool allowLiquidation_) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| allowLiquidation_ | bool |  | 

### liquidateBorrow

users repay all or some of an underwater borrow and receive collateral

```js
function liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure (see ErrorReporter.sol for details)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| targetAccount | address | The account whose borrow should be liquidated | 
| assetBorrow | address | The market asset to repay | 
| assetCollateral | address | The borrower's market asset to receive in exchange | 
| requestedAmountClose | uint256 | The amount to repay (or -1 for max) | 

### withdraw

withdraw `amount` of `asset` from sender's account to sender's address

```js
function withdraw(address asset, uint256 requestedAmount) public nonpayable
returns(uint256)
```

**Returns**

uint 0=success, otherwise a failure (see ErrorReporter.sol for details)

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address | The market asset to withdraw | 
| requestedAmount | uint256 | The amount to withdraw (or -1 for max) | 

### getSupplyBalance

return supply balance with any accumulated interest for `asset` belonging to `account`

```js
function getSupplyBalance(address account, address asset) public view
returns(uint256)
```

**Returns**

uint supply balance on success, throws on failed assertion otherwise

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | the account to examine | 
| asset | address | the market asset whose supply balance belonging to `account` should be checked | 

### getBorrowBalance

return borrow balance with any accumulated interest for `asset` belonging to `account`

```js
function getBorrowBalance(address account, address asset) public view
returns(uint256)
```

**Returns**

uint borrow balance on success, throws on failed assertion otherwise

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| account | address | the account to examine | 
| asset | address | the market asset whose borrow balance belonging to `account` should be checked | 

### liquidateBorrow

```js
function liquidateBorrow(address targetAccount, address assetBorrow, address assetCollateral, uint256 requestedAmountClose) public nonpayable
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| targetAccount | address |  | 
| assetBorrow | address |  | 
| assetCollateral | address |  | 
| requestedAmountClose | uint256 |  | 

### tokenAllowAll

```js
function tokenAllowAll(address asset, address allowee) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| allowee | address |  | 

### tokenTransferAll

```js
function tokenTransferAll(address asset, address recipient) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| recipient | address |  | 

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
