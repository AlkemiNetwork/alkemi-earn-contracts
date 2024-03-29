pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with basic tests.
 */
contract AlkemiEarnVerifiedTest_Basic is AlkemiEarnVerifiedTest {
    function testMin() public {
        Assert.equal(min(5, 6), 5, "min(5,6)=5");
        Assert.equal(min(6, 5), 5, "min(6,5)=5");
        Assert.equal(min(5, 5), 5, "min(5,5)=5");
        Assert.equal(min(uint256(-1), 0), 0, "min(max_uint, 0)=0");
        Assert.equal(min(0, uint256(-1)), 0, "min(0, max_uint)=0");
        Assert.equal(min(0, 0), 0, "min(0,0)=0");
        Assert.equal(
            min(uint256(-1), uint256(-1)),
            uint256(-1),
            "min(max_uint, max_uint)=max_uint"
        );
    }
}
