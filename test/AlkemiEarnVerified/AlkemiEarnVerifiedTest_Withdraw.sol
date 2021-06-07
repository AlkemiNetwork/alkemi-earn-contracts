pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";


/*
 * @dev This tests the withdraw function of the money market.
 */
contract AlkemiEarnVerifiedTest_Withdraw is AlkemiEarnVerifiedTest {

    function testBasicValidations() public {
        initializer();
        addKYCAdmin(msg.sender);
        addCustomerKYC(msg.sender);
        address token = address(this);

        uint err = withdraw(token, 10);
        Assert.equal(uint(Error.TOKEN_INSUFFICIENT_CASH), err, "should have returned Error.TOKEN_INSUFFICIENT_CASH");
    }
}