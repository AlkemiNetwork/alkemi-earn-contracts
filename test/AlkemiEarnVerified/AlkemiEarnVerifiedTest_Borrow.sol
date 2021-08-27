pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for borrow.
 */
contract AlkemiEarnVerifiedTest_Borrow is AlkemiEarnVerifiedTest {
    function testBorrow_MarketSupported() public {
        address token = address(this); // must be this
        initializer();
        _changeKYCAdmin(msg.sender, true);
        _changeCustomerKYC(msg.sender, true);

        uint256 err = borrow(token, 10);
        Assert.equal(
            uint256(Error.MARKET_NOT_SUPPORTED),
            err,
            "should have returned Error.MARKET_NOT_SUPPORTED"
        );
    }
}
