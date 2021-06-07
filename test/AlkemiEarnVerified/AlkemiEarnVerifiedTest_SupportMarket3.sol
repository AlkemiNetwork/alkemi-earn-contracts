pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedWithPriceTest.sol";

/*
 * @dev This tests the money market with tests for supportMarket part 3.
 */
contract AlkemiEarnVerifiedTest_SupportMarket3 is AlkemiEarnVerifiedWithPriceTest {

    function testSupportMarket_FailsIfPriceNotAlreadySet() public {
        initializer();
        clearCollateralMarkets();

        // This test is mostly to prove we haven't yet dealt with bad values, or may never
        address asset = nextAddress();

        admin = msg.sender;

        assertError(Error.ASSET_NOT_PRICED, Error(_supportMarket(asset, InterestRateModel(asset))), "expected Error.ASSET_NOT_PRICED");

        Assert.equal(markets[asset].isSupported, false, "market should not be supported");
        Assert.equal(markets[asset].interestRateModel, address(0), "market has no interest rate model set");
    }

    function clearCollateralMarkets() internal {
        collateralMarkets = new address[](0); // clear collateral markets
    }
}