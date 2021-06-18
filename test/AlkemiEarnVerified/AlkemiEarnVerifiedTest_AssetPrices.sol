pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

contract AlkemiEarnVerifiedTest_AssetPrices is AlkemiEarnVerifiedTest {
    function testHandlesUnsetPriceOracle() public {
        oracle = address(0);
        address asset = nextAddress();

        uint256 result = assetPrices(asset);
        Assert.equal(0, result, "returns 0 when oracle not set");
    }
}
