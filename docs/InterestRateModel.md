# The InterestRateModel Interface (InterestRateModel.sol)

View Source: [contracts/InterestRateModel.sol](../contracts/InterestRateModel.sol)

**InterestRateModel**

Any interest rate model should derive from this contract.

## Functions

- [getSupplyRate(address asset, uint256 cash, uint256 borrows)](#getsupplyrate)
- [getBorrowRate(address asset, uint256 cash, uint256 borrows)](#getborrowrate)

### getSupplyRate

Gets the current supply interest rate based on the given asset, total cash and total borrows

```js
function getSupplyRate(address asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the supply interest rate per block scaled by 10e18

**Arguments**

| Name    | Type    | Description                                  |
| ------- | ------- | -------------------------------------------- |
| asset   | address | The asset to get the interest rate of        |
| cash    | uint256 | The total cash of the asset in the market    |
| borrows | uint256 | The total borrows of the asset in the market |

### getBorrowRate

Gets the current borrow interest rate based on the given asset, total cash and total borrows

```js
function getBorrowRate(address asset, uint256 cash, uint256 borrows) public view
returns(uint256, uint256)
```

**Returns**

Success or failure and the borrow interest rate per block scaled by 10e18

**Arguments**

| Name    | Type    | Description                                  |
| ------- | ------- | -------------------------------------------- |
| asset   | address | The asset to get the interest rate of        |
| cash    | uint256 | The total cash of the asset in the market    |
| borrows | uint256 | The total borrows of the asset in the market |

## Contracts

- [CarefulMath](CarefulMath.md)
- [EIP20Interface](EIP20Interface.md)
- [EIP20NonStandardInterface](EIP20NonStandardInterface.md)
- [ErrorReporter](ErrorReporter.md)
- [ExchangeRateModel](ExchangeRateModel.md)
- [Exponential](Exponential.md)
- [InterestRateModel](InterestRateModel.md)
- [LiquidationChecker](LiquidationChecker.md)
- [Liquidator](Liquidator.md)
- [Migrations](Migrations.md)
- [MoneyMarket](MoneyMarket.md)
- [PriceOracle](PriceOracle.md)
- [PriceOracleInterface](PriceOracleInterface.md)
- [PriceOracleProxy](PriceOracleProxy.md)
- [SafeToken](SafeToken.md)
