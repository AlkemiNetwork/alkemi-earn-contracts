pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the money market with tests for supply.
 */
contract AlkemiEarnVerifiedTest_Supply is AlkemiEarnVerifiedTest {
    function testSupply_basicValidations() public {
        address token = address(this); // must be this
        address protocol = address(this); // must be this
        initializer();
        addKYCAdmin(msg.sender);
        addCustomerKYC(msg.sender);

        uint256 err = supply(token, 10);
        Assert.equal(
            uint256(Error.MARKET_NOT_SUPPORTED),
            err,
            "should have returned Error.MARKET_NOT_SUPPORTED"
        );

        markets[token].isSupported = true;

        err = supply(token, 10);
        Assert.equal(
            uint256(Error.TOKEN_INSUFFICIENT_ALLOWANCE),
            err,
            "should have returned Error.TOKEN_INSUFFICIENT_ALLOWANCE"
        );

        approve(protocol, 20); // allowed[customer][protocol] = 20; is not working. why not?
        err = supply(token, 10);
        Assert.equal(
            uint256(Error.TOKEN_INSUFFICIENT_BALANCE),
            err,
            "should have returned Error.TOKEN_INSUFFICIENT_BALANCE"
        );
    }
}
