# RewardControlStorage.sol

View Source: [contracts/RewardControlStorage.sol](../contracts/RewardControlStorage.sol)

**↘ Derived Contracts: [RewardControl](RewardControl.md)**

**RewardControlStorage**

## Structs
### MarketState

```js
struct MarketState {
 uint224 index,
 uint32 block
}
```

## Contract Members
**Constants & Variables**

```js
address[] public allMarkets;
mapping(address => bool) public allMarketsIndex;
uint256 public alkRate;
mapping(address => uint256) public alkSpeeds;
mapping(address => struct RewardControlStorage.MarketState) public alkSupplyState;
mapping(address => struct RewardControlStorage.MarketState) public alkBorrowState;
mapping(address => mapping(address => uint256)) public alkSupplierIndex;
mapping(address => mapping(address => uint256)) public alkBorrowerIndex;
mapping(address => uint256) public alkAccrued;
bool public initializationDone;
address public owner;
address public newOwner;
contract MoneyMarket public moneyMarket;
address public alkAddress;

```

## Functions

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
