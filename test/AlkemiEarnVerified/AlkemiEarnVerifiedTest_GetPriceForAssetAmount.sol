pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

contract AlkemiEarnVerifiedTest_GetPriceForAssetAmount is
    AlkemiEarnVerifiedTest
{
    // Note: other scenarios for getPriceForAssetAmount are tested via functions that use it; this test is to ensure line coverage
    function testHandlesUnsetPriceOracle() public {
        oracle = address(0);
        address asset = nextAddress();

        (Error err, Exp memory result) = getPriceForAssetAmount(asset, 90, false);
        assertError(
            Error.ZERO_ORACLE_ADDRESS,
            err,
            "should have failed from unset oracle"
        );
        Assert.equal(0, result.mantissa, "result.mantissa");
    }
}
