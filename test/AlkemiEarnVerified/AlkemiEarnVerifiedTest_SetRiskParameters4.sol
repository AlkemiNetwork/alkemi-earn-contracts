pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";
import "../MathHelpers.sol";

/*
 * @dev This tests the money market with tests for setRiskParameters.
 */
contract AlkemiEarnVerifiedTest_SetRiskParameters4 is AlkemiEarnVerifiedTest {

    /**
      * @dev helper that lets us create an Exp with `getExp` without cluttering our test code with error checks of the setup.
      */
    function getExpFromRational(uint numerator, uint denominator) internal returns (Exp memory) {
        (Error err, Exp memory result) = getExp(numerator, denominator);

        Assert.equal(0, uint(err), "getExpFromRational failed");
        return result;
    }

//     function testSetRiskParameters_LiquidationDiscountOverMaxValueFails() public {
//         admin = msg.sender;
//         initializer();
//         Exp memory oldRatio = collateralRatio;
//         Exp memory newRatio = getExpFromRational(120, 100);
//         // Make sure newRatio is different so our validation of the update is legitimate
//         Assert.notEqual(newRatio.mantissa, collateralRatio.mantissa, "setup failed; choose a different newRatio");

//         Exp memory oldDiscount = liquidationDiscount;
//         Exp memory newDiscount = getExpFromRational(30, 100);
//         Assert.notEqual(newDiscount.mantissa, oldDiscount.mantissa, "setup failed; choose a different newDiscount");
// uint _minimumCollateralRatioMantissa = minimumCollateralRatioMantissa;
// uint _maximumLiquidationDiscountMantissa = maximumLiquidationDiscountMantissa;

//         assertError(Error.INVALID_LIQUIDATION_DISCOUNT, Error(_setRiskParameters(newRatio.mantissa, newDiscount.mantissa, _minimumCollateralRatioMantissa, _maximumLiquidationDiscountMantissa)), "operation not should have succeeded");

//         Assert.equal(collateralRatio.mantissa, oldRatio.mantissa, "collateral ratio should retain previous value");
//         Assert.equal(liquidationDiscount.mantissa, oldDiscount.mantissa, "liquidation discount should retain previous value");
//     }

    function testSetRiskParameters_LiquidationDiscountPlusOneEqualsCollateralRatioFails() public {
        admin = msg.sender;
        initializer();
        Exp memory oldRatio = collateralRatio;
        Exp memory newRatio = getExpFromRational(110, 100);
        // Make sure newRatio is different so our validation of the update is legitimate
        Assert.notEqual(newRatio.mantissa, oldRatio.mantissa, "setup failed; choose a different newRatio");

        Exp memory oldDiscount = liquidationDiscount;
        Exp memory newDiscount = getExpFromRational(9, 100);
        Assert.notEqual(newDiscount.mantissa, oldDiscount.mantissa, "setup failed; choose a different newDiscount");
        uint _minimumCollateralRatioMantissa = minimumCollateralRatioMantissa;
        uint _maximumLiquidationDiscountMantissa = maximumLiquidationDiscountMantissa;
        assertError(Error.NO_ERROR,Error(_setRiskParameters(newRatio.mantissa, newDiscount.mantissa, _minimumCollateralRatioMantissa, _maximumLiquidationDiscountMantissa)),"operation not should have succeeded");

        // Assert.equal(collateralRatio.mantissa, oldRatio.mantissa, "collateral ratio should retain previous value");
        // Assert.equal(liquidationDiscount.mantissa, oldDiscount.mantissa, "liquidation discount should retain previous value");
    }
}