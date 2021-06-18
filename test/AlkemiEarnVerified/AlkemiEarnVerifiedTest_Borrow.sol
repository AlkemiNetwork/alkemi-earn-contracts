pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the money market with tests for borrow.
 */
contract AlkemiEarnVerifiedTest_Borrow is AlkemiEarnVerifiedTest {
    function testBorrow_MarketSupported() public {
        address token = address(this); // must be this
        initializer();
        addKYCAdmin(msg.sender);
        addCustomerKYC(msg.sender);

        uint256 err = borrow(token, 10);
        Assert.equal(
            uint256(Error.MARKET_NOT_SUPPORTED),
            err,
            "should have returned Error.MARKET_NOT_SUPPORTED"
        );
    }
}
