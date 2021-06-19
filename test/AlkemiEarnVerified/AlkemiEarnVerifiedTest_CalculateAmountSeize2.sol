pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedWithPriceTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for calculateAmountSeize
 */
contract AlkemiEarnVerifiedTest_CalculateAmountSeize2 is
    AlkemiEarnVerifiedWithPriceTest
{
    function testCalculateAmountSeize_OverflowOnMaxUintBorrowPrice() public {
        liquidationDiscount = Exp({mantissa: 10**16}); // 10% discount

        Exp memory underwaterAssetPrice = Exp({mantissa: 2**256 - 1});
        Exp memory collateralPrice = Exp({mantissa: mantissaOne * 550});

        (Error err, uint256 result) = calculateAmountSeize(
            underwaterAssetPrice,
            collateralPrice,
            5 * 10**18
        );
        Assert.equal(0, result, "default value");

        assertError(Error.INTEGER_OVERFLOW, err, "overflows");
    }

    function testCalculateAmountSeize_OverflowOnMaxUintAmountClose() public {
        liquidationDiscount = Exp({mantissa: 0}); // 0% discount

        Exp memory underwaterAssetPrice = Exp({mantissa: mantissaOne});
        Exp memory collateralPrice = Exp({mantissa: mantissaOne});

        (Error err, uint256 result) = calculateAmountSeize(
            underwaterAssetPrice,
            collateralPrice,
            2**256 - 1
        );
        Assert.equal(0, result, "default value");

        assertError(Error.INTEGER_OVERFLOW, err, "overflows");
    }
}
