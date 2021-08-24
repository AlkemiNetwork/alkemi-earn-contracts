pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedWithPriceTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for supportMarket part 2.
 */
contract AlkemiEarnVerifiedTest_SupportMarket2 is
    AlkemiEarnVerifiedWithPriceTest
{
    function testSupportMarket_NotAdmin() public {
        initializer();
        clearCollateralMarkets();

        address asset = nextAddress();
        admin = address(0);

        Assert.equal(
            markets[asset].isSupported,
            false,
            "market stays unsupported"
        );
    }

    function clearCollateralMarkets() internal {
        collateralMarkets = new address[](0); // clear collateral markets
    }
}
