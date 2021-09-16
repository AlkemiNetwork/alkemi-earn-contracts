---
layout: default
title: RewardControl
---

# RewardControl.sol

View Source: [contracts/RewardControl.sol](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/RewardControl.sol)

**↗ Extends:** [**RewardControlStorage**](rewardcontrolstorage.md)**,** [**RewardControlInterface**](rewardcontrolinterface.md)**,** [**ExponentialNoError**](exponentialnoerror.md)

\*\*\*\*

**Events**

```javascript
event AlkSpeedUpdated(address indexed market, uint256  newSpeed, bool  isVerified);
event DistributedSupplierAlk(address indexed market, address indexed supplier, uint256  supplierDelta, uint256  supplierAccruedAlk, uint256  supplyIndexMantissa, bool  isVerified);
event DistributedBorrowerAlk(address indexed market, address indexed borrower, uint256  borrowerDelta, uint256  borrowerAccruedAlk, uint256  borrowIndexMantissa, bool  isVerified);
event TransferredAlk(address indexed participant, uint256  participantAccrued, address  market, bool  isVerified);
event OwnerUpdate(address indexed owner, address indexed newOwner);
event MarketAdded(address indexed market, uint256  numberOfMarkets, bool  isVerified);
event MarketRemoved(address indexed market, uint256  numberOfMarkets, bool  isVerified);
```

### Modifiers

* onlyOwner

#### onlyOwner

Make sure that the sender is only the owner of the contract

```javascript
modifier onlyOwner() internal
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


### Functions

* initializer\(address \_owner, address \_alkemiEarnVerified, address \_alkemiEarnPublic, address \_alkAddress\)
* refreshAlkSupplyIndex\(address market, address supplier, bool isVerified\)
* refreshAlkBorrowIndex\(address market, address borrower, bool isVerified\)
* claimAlk\(address holder\)
* claimAlk\(address holder, address market, bool isVerified\)
* refreshMarketLiquidity\(\)
* refreshAlkSpeeds\(\)
* updateAlkSupplyIndex\(address market, bool isVerified\)
* updateAlkBorrowIndex\(address market, bool isVerified\)
* distributeSupplierAlk\(address market, address supplier, bool isVerified\)
* distributeBorrowerAlk\(address market, address borrower, bool isVerified\)
* claimAlk\(address holder, address\[\] markets, bool isVerified\)
* transferAlk\(address participant, uint256 participantAccrued, address market, bool isVerified\)
* getBlockNumber\(\)
* getAlkAccrued\(address participant\)
* getAlkAddress\(\)
* getAlkemiEarnAddress\(\)
* getMarketStats\(address market, bool isVerified\)
* getMarketTotalSupply\(address market, bool isVerified\)
* getMarketTotalBorrows\(address market, bool isVerified\)
* getSupplyBalance\(address market, address supplier, bool isVerified\)
* getBorrowBalance\(address market, address borrower, bool isVerified\)
* transferOwnership\(address \_newOwner\)
* acceptOwnership\(\)
* addMarket\(address market, bool isVerified\)
* removeMarket\(uint256 id, bool isVerified\)
* setAlkAddress\(address \_alkAddress\)
* setAlkemiEarnVerifiedAddress\(address \_alkemiEarnVerified\)
* setAlkemiEarnPublicAddress\(address \_alkemiEarnPublic\)
* setAlkRate\(uint256 \_alkRate\)
* getAlkRewards\(address user\)
* getSupplyAlkRewards\(struct ExponentialNoError.Exp totalLiquidity, struct ExponentialNoError.Exp\[\] marketTotalLiquidity, address user, uint256 i, uint256 j, bool isVerified\)
* getBorrowAlkRewards\(struct ExponentialNoError.Exp totalLiquidity, struct ExponentialNoError.Exp\[\] marketTotalLiquidity, address user, uint256 i, uint256 j, bool isVerified\)

#### initializer

`RewardControl` is the contract to calculate and distribute reward tokens

```javascript
function initializer(address _owner, address _alkemiEarnVerified, address _alkemiEarnPublic, address _alkAddress) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_owner | address |  |
| \_alkemiEarnVerified | address |  |
| \_alkemiEarnPublic | address |  |
| \_alkAddress | address |  |

#### refreshAlkSupplyIndex

⤾ overrides [RewardControlInterface.refreshAlkSupplyIndex](RewardControlInterface.md#refreshalksupplyindex)

Refresh ALK supply index for the specified market and supplier

```javascript
function refreshAlkSupplyIndex(address market, address supplier, bool isVerified) external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The market whose supply index to update |
| supplier | address | The address of the supplier to distribute ALK to |
| isVerified | bool | Specifies if the market is from verified or public protocol |

#### refreshAlkBorrowIndex

⤾ overrides [RewardControlInterface.refreshAlkBorrowIndex](RewardControlInterface.md#refreshalkborrowindex)

Refresh ALK borrow index for the specified market and borrower

```javascript
function refreshAlkBorrowIndex(address market, address borrower, bool isVerified) external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The market whose borrow index to update |
| borrower | address | The address of the borrower to distribute ALK to |
| isVerified | bool | Specifies if the market is from verified or public protocol |

#### claimAlk

⤾ overrides [RewardControlInterface.claimAlk](RewardControlInterface.md#claimalk)

Claim all the ALK accrued by holder in all markets

```javascript
function claimAlk(address holder) external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| holder | address | The address to claim ALK for |

#### claimAlk

⤾ overrides [RewardControlInterface.claimAlk](RewardControlInterface.md#claimalk)

Claim all the ALK accrued by holder by refreshing the indexes on the specified market only

```javascript
function claimAlk(address holder, address market, bool isVerified) external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| holder | address | The address to claim ALK for |
| market | address | The address of the market to refresh the indexes for |
| isVerified | bool | Specifies if the market is from verified or public protocol |

#### refreshMarketLiquidity

Recalculate and update ALK speeds for all markets

```javascript
function refreshMarketLiquidity() internal view
returns(struct ExponentialNoError.Exp[], struct ExponentialNoError.Exp)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### refreshAlkSpeeds

Recalculate and update ALK speeds for all markets

```javascript
function refreshAlkSpeeds() public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### updateAlkSupplyIndex

Accrue ALK to the market by updating the supply index

```javascript
function updateAlkSupplyIndex(address market, bool isVerified) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The market whose supply index to update |
| isVerified | bool | Verified / Public protocol |

#### updateAlkBorrowIndex

Accrue ALK to the market by updating the borrow index

```javascript
function updateAlkBorrowIndex(address market, bool isVerified) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The market whose borrow index to update |
| isVerified | bool | Verified / Public protocol |

#### distributeSupplierAlk

Calculate ALK accrued by a supplier and add it on top of alkAccrued\[supplier\]

```javascript
function distributeSupplierAlk(address market, address supplier, bool isVerified) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The market in which the supplier is interacting |
| supplier | address | The address of the supplier to distribute ALK to |
| isVerified | bool | Verified / Public protocol |

#### distributeBorrowerAlk

Calculate ALK accrued by a borrower and add it on top of alkAccrued\[borrower\]

```javascript
function distributeBorrowerAlk(address market, address borrower, bool isVerified) public nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The market in which the borrower is interacting |
| borrower | address | The address of the borrower to distribute ALK to |
| isVerified | bool | Verified / Public protocol |

#### claimAlk

Claim all the ALK accrued by holder in the specified markets

```javascript
function claimAlk(address holder, address[] markets, bool isVerified) internal nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| holder | address | The address to claim ALK for |
| markets | address\[\] | The list of markets to claim ALK in |
| isVerified | bool | Verified / Public protocol |

#### transferAlk

Transfer ALK to the participant

```javascript
function transferAlk(address participant, uint256 participantAccrued, address market, bool isVerified) internal nonpayable
returns(uint256)
```

**Returns**

The amount of ALK which was NOT transferred to the participant

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| participant | address | The address of the participant to transfer ALK to |
| participantAccrued | uint256 | The amount of ALK to \(possibly\) transfer |
| market | address | Market for which ALK is transferred |
| isVerified | bool | Verified / Public Protocol |

#### getBlockNumber

Get the current block number

```javascript
function getBlockNumber() public view
returns(uint256)
```

**Returns**

The current block number

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### getAlkAccrued

Get the current accrued ALK for a participant

```javascript
function getAlkAccrued(address participant) public view
returns(uint256)
```

**Returns**

The amount of accrued ALK for the participant

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| participant | address | The address of the participant |

#### getAlkAddress

Get the address of the ALK token

```javascript
function getAlkAddress() public view
returns(address)
```

**Returns**

The address of ALK token

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### getAlkemiEarnAddress

Get the address of the underlying AlkemiEarnVerified and AlkemiEarnPublic contract

```javascript
function getAlkemiEarnAddress() public view
returns(address, address)
```

**Returns**

The address of the underlying AlkemiEarnVerified and AlkemiEarnPublic contract

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### getMarketStats

Get market statistics from the AlkemiEarnVerified contract

```javascript
function getMarketStats(address market, bool isVerified) public view
returns(isSupported bool, blockNumber uint256, interestRateModel address, totalSupply uint256, supplyRateMantissa uint256, supplyIndex uint256, totalBorrows uint256, borrowRateMantissa uint256, borrowIndex uint256)
```

**Returns**

Market statistics for the given market

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The address of the market |
| isVerified | bool | Verified / Public protocol |

#### getMarketTotalSupply

Get market total supply from the AlkemiEarnVerified / AlkemiEarnPublic contract

```javascript
function getMarketTotalSupply(address market, bool isVerified) public view
returns(uint256)
```

**Returns**

Market total supply for the given market

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The address of the market |
| isVerified | bool | Verified / Public protocol |

#### getMarketTotalBorrows

Get market total borrows from the AlkemiEarnVerified contract

```javascript
function getMarketTotalBorrows(address market, bool isVerified) public view
returns(uint256)
```

**Returns**

Market total borrows for the given market

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The address of the market |
| isVerified | bool | Verified / Public protocol |

#### getSupplyBalance

Get supply balance of the specified market and supplier

```javascript
function getSupplyBalance(address market, address supplier, bool isVerified) public view
returns(uint256)
```

**Returns**

Supply balance of the specified market and supplier

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The address of the market |
| supplier | address | The address of the supplier |
| isVerified | bool | Verified / Public protocol |

#### getBorrowBalance

Get borrow balance of the specified market and borrower

```javascript
function getBorrowBalance(address market, address borrower, bool isVerified) public view
returns(uint256)
```

**Returns**

Borrow balance of the specified market and borrower

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The address of the market |
| borrower | address | The address of the borrower |
| isVerified | bool | Verified / Public protocol |

#### transferOwnership

Transfer the ownership of this contract to the new owner. The ownership will not be transferred until the new owner accept it.

```javascript
function transferOwnership(address _newOwner) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_newOwner | address | The address of the new owner |

#### acceptOwnership

Accept the ownership of this contract by the new owner

```javascript
function acceptOwnership() external nonpayable
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |


#### addMarket

Add new market to the reward program

```javascript
function addMarket(address market, bool isVerified) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| market | address | The address of the new market to be added to the reward program |
| isVerified | bool | Verified / Public protocol |

#### removeMarket

Remove a market from the reward program based on array index

```javascript
function removeMarket(uint256 id, bool isVerified) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| id | uint256 | The index of the `allMarkets` array to be removed |
| isVerified | bool | Verified / Public protocol |

#### setAlkAddress

Set ALK token address

```javascript
function setAlkAddress(address _alkAddress) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_alkAddress | address | The ALK token address |

#### setAlkemiEarnVerifiedAddress

Set AlkemiEarnVerified contract address

```javascript
function setAlkemiEarnVerifiedAddress(address _alkemiEarnVerified) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_alkemiEarnVerified | address | The AlkemiEarnVerified contract address |

#### setAlkemiEarnPublicAddress

Set AlkemiEarnPublic contract address

```javascript
function setAlkemiEarnPublicAddress(address _alkemiEarnPublic) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_alkemiEarnPublic | address | The AlkemiEarnVerified contract address |

#### setAlkRate

Set ALK rate

```javascript
function setAlkRate(uint256 _alkRate) external nonpayable onlyOwner
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_alkRate | uint256 | The ALK rate |

#### getAlkRewards

Get latest ALK rewards

```javascript
function getAlkRewards(address user) external view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| user | address | the supplier/borrower |

#### getSupplyAlkRewards

Get latest Supply ALK rewards

```javascript
function getSupplyAlkRewards(struct ExponentialNoError.Exp totalLiquidity, struct ExponentialNoError.Exp[] marketTotalLiquidity, address user, uint256 i, uint256 j, bool isVerified) internal view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| totalLiquidity | struct ExponentialNoError.Exp | Total Liquidity of all markets |
| marketTotalLiquidity | struct ExponentialNoError.Exp\[\] | Array of individual market liquidity |
| user | address | the supplier |
| i | uint256 | index of the market in marketTotalLiquidity array |
| j | uint256 | index of the market in the verified/public allMarkets array |
| isVerified | bool | Verified / Public protocol |

#### getBorrowAlkRewards

Get latest Borrow ALK rewards

```javascript
function getBorrowAlkRewards(struct ExponentialNoError.Exp totalLiquidity, struct ExponentialNoError.Exp[] marketTotalLiquidity, address user, uint256 i, uint256 j, bool isVerified) internal view
returns(uint256)
```

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| totalLiquidity | struct ExponentialNoError.Exp | Total Liquidity of all markets |
| marketTotalLiquidity | struct ExponentialNoError.Exp\[\] | Array of individual market liquidity |
| user | address | the borrower |
| i | uint256 | index of the market in marketTotalLiquidity array |
| j | uint256 | index of the market in the verified/public allMarkets array |
| isVerified | bool | Verified / Public protocol |

