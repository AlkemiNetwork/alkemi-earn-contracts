# RewardControl.sol

View Source: [contracts/RewardControl.sol](../contracts/RewardControl.sol)

**↗ Extends: [RewardControlStorage](RewardControlStorage.md), [RewardControlInterface](RewardControlInterface.md), [ExponentialNoError](ExponentialNoError.md)**

**RewardControl**

**Events**

```js
event AlkSpeedUpdated(address indexed market, uint256  newSpeed);
event DistributedSupplierAlk(address indexed market, address indexed supplier, uint256  supplierDelta, uint256  supplierAccruedAlk, uint256  supplyIndexMantissa);
event DistributedBorrowerAlk(address indexed market, address indexed borrower, uint256  borrowerDelta, uint256  borrowerAccruedAlk, uint256  borrowIndexMantissa);
event TransferredAlk(address indexed participant, uint256  participantAccrued);
event OwnerUpdate(address indexed owner, address indexed newOwner);
event MarketAdded(address indexed market, uint256  numberOfMarkets);
event MarketRemoved(address indexed market, uint256  numberOfMarkets);
```

## Modifiers

- [onlyOwner](#onlyowner)

### onlyOwner

Make sure that the sender is only the owner of the contract

```js
modifier onlyOwner() internal
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

## Functions

- [initializer(address _owner, address _moneyMarket, address _alkAddress)](#initializer)
- [refreshAlkSupplyIndex(address market, address supplier)](#refreshalksupplyindex)
- [refreshAlkBorrowIndex(address market, address borrower)](#refreshalkborrowindex)
- [claimAlk(address holder)](#claimalk)
- [claimAlk(address holder, address market)](#claimalk)
- [refreshAlkSpeeds()](#refreshalkspeeds)
- [updateAlkSupplyIndex(address market)](#updatealksupplyindex)
- [updateAlkBorrowIndex(address market)](#updatealkborrowindex)
- [distributeSupplierAlk(address market, address supplier)](#distributesupplieralk)
- [distributeBorrowerAlk(address market, address borrower)](#distributeborroweralk)
- [claimAlk(address holder, address[] markets)](#claimalk)
- [transferAlk(address participant, uint256 participantAccrued)](#transferalk)
- [getBlockNumber()](#getblocknumber)
- [getAlkAccrued(address participant)](#getalkaccrued)
- [getAlkAddress()](#getalkaddress)
- [getMoneyMarketAddress()](#getmoneymarketaddress)
- [getMarketStats(address market)](#getmarketstats)
- [getMarketTotalSupply(address market)](#getmarkettotalsupply)
- [getMarketTotalBorrows(address market)](#getmarkettotalborrows)
- [getSupplyBalance(address market, address supplier)](#getsupplybalance)
- [getBorrowBalance(address market, address borrower)](#getborrowbalance)
- [transferOwnership(address _newOwner)](#transferownership)
- [acceptOwnership()](#acceptownership)
- [addMarket(address market)](#addmarket)
- [removeMarket(uint256 id)](#removemarket)
- [setAlkAddress(address _alkAddress)](#setalkaddress)
- [setMoneyMarketAddress(address _moneyMarket)](#setmoneymarketaddress)
- [setAlkRate(uint256 _alkRate)](#setalkrate)

### initializer

`RewardControl` is the contract to calculate and distribute reward tokens

```js
function initializer(address _owner, address _moneyMarket, address _alkAddress) public nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _owner | address |  | 
| _moneyMarket | address |  | 
| _alkAddress | address |  | 

### refreshAlkSupplyIndex

⤾ overrides [RewardControlInterface.refreshAlkSupplyIndex](RewardControlInterface.md#refreshalksupplyindex)

Refresh ALK supply index for the specified market and supplier

```js
function refreshAlkSupplyIndex(address market, address supplier) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The market whose supply index to update | 
| supplier | address | The address of the supplier to distribute ALK to | 

### refreshAlkBorrowIndex

⤾ overrides [RewardControlInterface.refreshAlkBorrowIndex](RewardControlInterface.md#refreshalkborrowindex)

Refresh ALK borrow index for the specified market and borrower

```js
function refreshAlkBorrowIndex(address market, address borrower) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The market whose borrow index to update | 
| borrower | address | The address of the borrower to distribute ALK to | 

### claimAlk

⤾ overrides [RewardControlInterface.claimAlk](RewardControlInterface.md#claimalk)

Claim all the ALK accrued by holder in all markets

```js
function claimAlk(address holder) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| holder | address | The address to claim ALK for | 

### claimAlk

⤾ overrides [RewardControlInterface.claimAlk](RewardControlInterface.md#claimalk)

Claim all the ALK accrued by holder by refreshing the indexes on the specified market only

```js
function claimAlk(address holder, address market) external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| holder | address | The address to claim ALK for | 
| market | address | The address of the market to refresh the indexes for | 

### refreshAlkSpeeds

Recalculate and update ALK speeds for all markets

```js
function refreshAlkSpeeds() internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### updateAlkSupplyIndex

Accrue ALK to the market by updating the supply index

```js
function updateAlkSupplyIndex(address market) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The market whose supply index to update | 

### updateAlkBorrowIndex

Accrue ALK to the market by updating the borrow index

```js
function updateAlkBorrowIndex(address market) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The market whose borrow index to update | 

### distributeSupplierAlk

Calculate ALK accrued by a supplier and add it on top of alkAccrued[supplier]

```js
function distributeSupplierAlk(address market, address supplier) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The market in which the supplier is interacting | 
| supplier | address | The address of the supplier to distribute ALK to | 

### distributeBorrowerAlk

Calculate ALK accrued by a borrower and add it on top of alkAccrued[borrower]

```js
function distributeBorrowerAlk(address market, address borrower) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The market in which the borrower is interacting | 
| borrower | address | The address of the borrower to distribute ALK to | 

### claimAlk

Claim all the ALK accrued by holder in the specified markets

```js
function claimAlk(address holder, address[] markets) internal nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| holder | address | The address to claim ALK for | 
| markets | address[] | The list of markets to claim ALK in | 

### transferAlk

Transfer ALK to the participant

```js
function transferAlk(address participant, uint256 participantAccrued) internal nonpayable
returns(uint256)
```

**Returns**

The amount of ALK which was NOT transferred to the participant

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| participant | address | The address of the participant to transfer ALK to | 
| participantAccrued | uint256 | The amount of ALK to (possibly) transfer | 

### getBlockNumber

Get the current block number

```js
function getBlockNumber() public view
returns(uint256)
```

**Returns**

The current block number

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getAlkAccrued

Get the current accrued ALK for a participant

```js
function getAlkAccrued(address participant) public view
returns(uint256)
```

**Returns**

The amount of accrued ALK for the participant

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| participant | address | The address of the participant | 

### getAlkAddress

Get the address of the ALK token

```js
function getAlkAddress() public view
returns(address)
```

**Returns**

The address of ALK token

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getMoneyMarketAddress

Get the address of the underlying Money Market contract

```js
function getMoneyMarketAddress() public view
returns(address)
```

**Returns**

The address of the underlying Money Market contract

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### getMarketStats

Get market statistics from the Money Market contract

```js
function getMarketStats(address market) public view
returns(uint256, uint256)
```

**Returns**

Market statistics for the given market

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The address of the market | 

### getMarketTotalSupply

Get market total supply from the Money Market contract

```js
function getMarketTotalSupply(address market) public view
returns(uint256)
```

**Returns**

Market total supply for the given market

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The address of the market | 

### getMarketTotalBorrows

Get market total borrows from the Money Market contract

```js
function getMarketTotalBorrows(address market) public view
returns(uint256)
```

**Returns**

Market total borrows for the given market

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The address of the market | 

### getSupplyBalance

Get supply balance of the specified market and supplier

```js
function getSupplyBalance(address market, address supplier) public view
returns(uint256)
```

**Returns**

Supply balance of the specified market and supplier

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The address of the market | 
| supplier | address | The address of the supplier | 

### getBorrowBalance

Get borrow balance of the specified market and borrower

```js
function getBorrowBalance(address market, address borrower) public view
returns(uint256)
```

**Returns**

Borrow balance of the specified market and borrower

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The address of the market | 
| borrower | address | The address of the borrower | 

### transferOwnership

Transfer the ownership of this contract to the new owner. The ownership will not be transferred until the new owner accept it.

```js
function transferOwnership(address _newOwner) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _newOwner | address | The address of the new owner | 

### acceptOwnership

Accept the ownership of this contract by the new owner

```js
function acceptOwnership() external nonpayable
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|

### addMarket

Add new market to the reward program

```js
function addMarket(address market) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| market | address | The address of the new market to be added to the reward program | 

### removeMarket

Remove a market from the reward program based on array index

```js
function removeMarket(uint256 id) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| id | uint256 | The index of the `allMarkets` array to be removed | 

### setAlkAddress

Set ALK token address

```js
function setAlkAddress(address _alkAddress) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _alkAddress | address | The ALK token address | 

### setMoneyMarketAddress

Set Money Market contract address

```js
function setMoneyMarketAddress(address _moneyMarket) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _moneyMarket | address | The Money Market contract address | 

### setAlkRate

Set ALK rate

```js
function setAlkRate(uint256 _alkRate) external nonpayable onlyOwner 
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _alkRate | uint256 | The ALK rate | 

## Contracts

* [AggregatorV3Interface](AggregatorV3Interface.md)
* [AlkemiEarnPublicV10](AlkemiEarnPublicV10.md)
* [AlkemiRateModel](AlkemiRateModel.md)
* [AlkemiWETH](AlkemiWETH.md)
* [CarefulMath](CarefulMath.md)
* [ChainLink](ChainLink.md)
* [EIP20Interface](EIP20Interface.md)
* [EIP20NonStandardInterface](EIP20NonStandardInterface.md)
* [ErrorReporter](ErrorReporter.md)
* [ExchangeRateModel](ExchangeRateModel.md)
* [Exponential](Exponential.md)
* [ExponentialNoError](ExponentialNoError.md)
* [InterestRateModel](InterestRateModel.md)
* [JumpRateModel](JumpRateModel.md)
* [JumpRateModelV2](JumpRateModelV2.md)
* [LiquidationChecker](LiquidationChecker.md)
* [Liquidator](Liquidator.md)
* [Migrations](Migrations.md)
* [MoneyMarket](MoneyMarket.md)
* [MoneyMarketV11](MoneyMarketV11.md)
* [MoneyMarketV12](MoneyMarketV12.md)
* [PriceOracle](PriceOracle.md)
* [PriceOracleInterface](PriceOracleInterface.md)
* [PriceOracleProxy](PriceOracleProxy.md)
* [RewardControl](RewardControl.md)
* [RewardControlInterface](RewardControlInterface.md)
* [RewardControlStorage](RewardControlStorage.md)
* [SafeMath](SafeMath.md)
* [SafeToken](SafeToken.md)
* [StableCoinInterestRateModel](StableCoinInterestRateModel.md)
* [StandardInterestRateModel](StandardInterestRateModel.md)
* [TestTokens](TestTokens.md)
