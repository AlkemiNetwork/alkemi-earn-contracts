pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedWithPriceTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for calculateDiscountedBorrowDenominatedCollateral
 *      discountedBorrowDenominatedCollateral = [supplyCurrent / (1 + liquidationDiscount)] * (Oracle price for the collateral / Oracle price for the borrow)
 */
contract AlkemiEarnVerifiedTest_CalculateDiscountedBorrowDenominatedCollateral is
    AlkemiEarnVerifiedWithPriceTest
{
    function testCalculateDiscountedBorrowDenominatedCollateral_HappyPathNoDiscount()
        public
    {
        liquidationDiscount = Exp({mantissa: 0});

        Exp memory collateralPrice = Exp({mantissa: mantissaOne * 3});
        Exp memory underwaterAssetPrice = Exp({mantissa: mantissaOne});

        (
            Error err,
            uint256 result
        ) = calculateDiscountedBorrowDenominatedCollateral(
            underwaterAssetPrice,
            collateralPrice,
            2 * 10**18
        );
        assertNoError(err);

        Assert.equal(6 * 10**18, result, "2e18 * (3/1)");
    }

    function testCalculateDiscountedBorrowDenominatedCollateral_HappyPathDiscounted()
        public
    {
        liquidationDiscount = Exp({mantissa: 10**17}); // .1

        Exp memory collateralPrice = Exp({mantissa: mantissaOne * 3});
        Exp memory underwaterAssetPrice = Exp({mantissa: mantissaOne});

        (
            Error err,
            uint256 result
        ) = calculateDiscountedBorrowDenominatedCollateral(
            underwaterAssetPrice,
            collateralPrice,
            2 * 10**18
        );
        assertNoError(err);

        Assert.equal(5454545454545454545, result, "2e18/1.1 * (3/1)");
    }

    function testCalculateDiscountedBorrowDenominatedCollateral_RidiculousLiquidationDiscountCausesOverflow()
        public
    {
        liquidationDiscount = Exp({mantissa: 2**256 - 1}); // completely ridiculous value

        Exp memory collateralPrice = Exp({mantissa: mantissaOne * 3});
        Exp memory underwaterAssetPrice = Exp({mantissa: mantissaOne});

        (
            Error err,
            uint256 result
        ) = calculateDiscountedBorrowDenominatedCollateral(
            underwaterAssetPrice,
            collateralPrice,
            2**237
        );
        assertZero(result, "default value");

        assertError(
            Error.INTEGER_OVERFLOW,
            err,
            "should overflow from a huge liquidationDiscount"
        );
    }
}
