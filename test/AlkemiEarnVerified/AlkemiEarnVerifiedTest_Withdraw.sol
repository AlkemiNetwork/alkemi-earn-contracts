pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the withdraw function of the Alkemi Earn Verified.
 */
contract AlkemiEarnVerifiedTest_Withdraw is AlkemiEarnVerifiedTest {
    function testBasicValidations() public {
        initializer();
        _changeKYCAdmin(msg.sender,true);
        _changeCustomerKYC(msg.sender,true);
        address token = address(this);

        uint256 err = withdraw(token, 10);
        Assert.equal(
            uint256(Error.TOKEN_INSUFFICIENT_CASH),
            err,
            "should have returned Error.TOKEN_INSUFFICIENT_CASH"
        );
    }
}
