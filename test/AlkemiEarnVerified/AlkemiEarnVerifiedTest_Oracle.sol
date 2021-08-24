pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for oracle activities.
 */
contract AlkemiEarnVerifiedTest_Oracle is AlkemiEarnVerifiedTest {
    function testSetOracle_NotAdmin() public {
        address addr1 = nextAddress();
        address addr2 = nextAddress();

        oracle = addr1;
        admin = addr2;
        Assert.equal(oracle, addr1, "oracle should remain addr1");
    }
}
