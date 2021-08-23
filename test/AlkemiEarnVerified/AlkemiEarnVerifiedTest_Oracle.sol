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
        address addr3 = nextAddress();

        oracle = addr1;
        admin = addr2;

        assertError(
            Error.UNAUTHORIZED,
            Error(_adminFunctions(addr1,addr3,false,1000000000000000,0)),
            "should fail as not admin"
        );
        Assert.equal(oracle, addr1, "oracle should remain addr1");
    }
}
