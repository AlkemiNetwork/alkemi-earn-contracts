pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the money market with tests for _setPendingAdmin.
 */
contract AlkemiEarnVerifiedTest_SetPendingAdmin is AlkemiEarnVerifiedTest {
    function testSetPendingAdmin_asAdmin() public {
        address addr1 = nextAddress();
        initializer();

        admin = msg.sender;

        assertNoError(Error(_setPendingAdmin(addr1)));
        Assert.equal(pendingAdmin, addr1, "should be addr1");
    }
}
