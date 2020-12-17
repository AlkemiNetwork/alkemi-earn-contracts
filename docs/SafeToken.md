# SafeToken.sol

View Source: [contracts/SafeToken.sol](../contracts/SafeToken.sol)

**↗ Extends: [ErrorReporter](ErrorReporter.md)**
**↘ Derived Contracts: [LiquidationChecker](LiquidationChecker.md), [Liquidator](Liquidator.md), [MoneyMarket](MoneyMarket.md)**

**SafeToken**

## Functions

- [checkTransferIn(address asset, address from, uint256 amount)](#checktransferin)
- [doTransferIn(address asset, address from, uint256 amount)](#dotransferin)
- [getCash(address asset)](#getcash)
- [getBalanceOf(address asset, address from)](#getbalanceof)
- [doTransferOut(address asset, address to, uint256 amount)](#dotransferout)
- [doApprove(address asset, address to, uint256 amount)](#doapprove)

### checkTransferIn

Checks whether or not there is sufficient allowance for this contract to move amount from `from` and
     whether or not `from` has a balance of at least `amount`. Does NOT do a transfer.

```js
function checkTransferIn(address asset, address from, uint256 amount) internal view
returns(enum ErrorReporter.Error)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| from | address |  | 
| amount | uint256 |  | 

### doTransferIn

Similar to EIP20 transfer, except it handles a False result from `transferFrom` and returns an explanatory
     error code rather than reverting.  If caller has not called `checkTransferIn`, this may revert due to
     insufficient balance or insufficient allowance. If caller has called `checkTransferIn` prior to this call,
     and it returned Error.NO_ERROR, this should not revert in normal conditions.
     *      Note: This wrapper safely handles non-standard ERC-20 tokens that do not return a value.
           See here: https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca

```js
function doTransferIn(address asset, address from, uint256 amount) internal nonpayable
returns(enum ErrorReporter.Error)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| from | address |  | 
| amount | uint256 |  | 

### getCash

Checks balance of this contract in asset

```js
function getCash(address asset) internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 

### getBalanceOf

Checks balance of `from` in `asset`

```js
function getBalanceOf(address asset, address from) internal view
returns(uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| from | address |  | 

### doTransferOut

Similar to EIP20 transfer, except it handles a False result from `transfer` and returns an explanatory
     error code rather than reverting. If caller has not called checked protocol's balance, this may revert due to
     insufficient cash held in this contract. If caller has checked protocol's balance prior to this call, and verified
     it is >= amount, this should not revert in normal conditions.
     *      Note: This wrapper safely handles non-standard ERC-20 tokens that do not return a value.
           See here: https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca

```js
function doTransferOut(address asset, address to, uint256 amount) internal nonpayable
returns(enum ErrorReporter.Error)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| to | address |  | 
| amount | uint256 |  | 

### doApprove

```js
function doApprove(address asset, address to, uint256 amount) internal nonpayable
returns(enum ErrorReporter.Error)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| asset | address |  | 
| to | address |  | 
| amount | uint256 |  | 

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
