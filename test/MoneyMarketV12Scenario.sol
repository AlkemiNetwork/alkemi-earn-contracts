pragma solidity ^0.4.24;

import "../contracts/MoneyMarketV12.sol";

contract MoneyMarketV12Scenario is MoneyMarketV12 {
    uint constant defaultOriginationFee = 5 * 10 ** 16; // default is 0.05 for scenario tests
    uint constant minimumCollateralRatioMantissa = 0;
    uint constant defaultLiquidationDiscountMantissa = 5 * (10 ** 16); // default is 0.05 for scenario tests

    uint stubBlockNumber;

    constructor() public MoneyMarketV12() {
        // I would imagine MoneyMarket would use the overriden
        // value of `defaultOriginationFee`, but it seems it does
        // not. As such, as set it in this constructor.
        originationFee = Exp({mantissa: defaultOriginationFee});
        liquidationDiscount = Exp({mantissa: defaultLiquidationDiscountMantissa});
    }

    function getBlockNumber() internal view returns (uint) {
        if (stubBlockNumber == 0) {
            return block.number;
        } else {
            return stubBlockNumber;
        }
    }

    function setBlockNumber(uint blockNumber) public {
        stubBlockNumber = blockNumber;
    }

}