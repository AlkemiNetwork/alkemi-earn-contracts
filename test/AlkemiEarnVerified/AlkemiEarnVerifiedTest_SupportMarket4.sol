pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedWithPriceTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for supportMarket part 4.
 */
contract AlkemiEarnVerifiedTest_SupportMarket4 is
    AlkemiEarnVerifiedWithPriceTest
{
    function testSupportMarket_Suspended() public {
        initializer();
        collateralMarkets = new address[](0); // clear collateral markets

        address asset = nextAddress();

        admin = msg.sender;
        assertNoError(Error(_setAssetPrice(asset, 500)));

        assertNoError(Error(_supportMarket(asset, InterestRateModel(asset))));
        Assert.equal(markets[asset].isSupported, true, "market is supported");

        // Let's tweak the indexes away from defaults so we can verify that re-supporting does not change them.
        markets[asset].supplyIndex = 5;
        markets[asset].borrowIndex = 6;

        assertNoError(Error(_suspendMarket(asset)));
        Assert.equal(markets[asset].isSupported, false, "market is suspended");
        // end of lengthy setup

        assertNoError(Error(_supportMarket(asset, InterestRateModel(asset))));

        Assert.equal(markets[asset].isSupported, true, "supported again");
        Assert.equal(
            markets[asset].interestRateModel,
            asset,
            "should still have interest rate model"
        );
        Assert.equal(markets[asset].supplyIndex, 5, "supply index unchanged");
        Assert.equal(markets[asset].borrowIndex, 6, "borrow index unchanged");
    }
}
