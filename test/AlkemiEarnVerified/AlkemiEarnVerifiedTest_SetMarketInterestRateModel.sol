pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for setMarketInterestRateModel.
 */
contract AlkemiEarnVerifiedTest_SetMarketInterestRateModel is
    AlkemiEarnVerifiedTest
{
    function testSetMarketInterestRateModel_NotAdmin() public {
        address asset = nextAddress();
        // InterestRateModel model = InterestRateModel(nextAddress());
        admin = address(0);

        Assert.equal(
            markets[asset].interestRateModel,
            address(0),
            "market does not get interest rate model"
        );
    }

    function testSetMarketInterestRateModel_Success() public {
        address asset = nextAddress();
        InterestRateModel model = InterestRateModel(nextAddress());
        admin = msg.sender;

        assertNoError(Error(_setMarketInterestRateModel(asset, model)));

        Assert.equal(
            markets[asset].interestRateModel,
            model,
            "market gets interest rate model"
        );
    }

    function testSetMarketInterestRateModel_SuccessfulUpdate() public {
        address asset = nextAddress();
        InterestRateModel model1 = InterestRateModel(nextAddress());
        InterestRateModel model2 = InterestRateModel(nextAddress());
        admin = msg.sender;

        assertNoError(Error(_setMarketInterestRateModel(asset, model1)));

        Assert.equal(
            markets[asset].interestRateModel,
            model1,
            "market gets interest rate model"
        );

        assertNoError(Error(_setMarketInterestRateModel(asset, model2)));

        Assert.equal(
            markets[asset].interestRateModel,
            model2,
            "market gets updated interest rate model"
        );
    }
}
