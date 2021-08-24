pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/**
 * @dev This tests the Alkemi Earn Verified with tests for _withdrawEquity.
 */
contract AlkemiEarnVerifiedTest_WithdrawEquity is AlkemiEarnVerifiedTest {
    function testWithdrawEquity_NotAdmin() public {
        initializer();
        _changeKYCAdmin(msg.sender,true);
        _changeCustomerKYC(msg.sender,true);
        address asset = address(this);
        balances[asset] = 10000;

        // Update admin to so admin check will fail
        admin = address(0);
        Assert.equal(
            0,
            balances[admin],
            "setup failed; admin should have no token balance"
        );

        Assert.equal(10000, balances[asset], "cash should be unchanged");

        Assert.equal(0, balances[admin], "admin should have no token balance");
    }

    function testWithdrawEquity_AmountTooLargeCashOnly() public {
        address asset = address(this);
        address protocol = address(this);
        balances[protocol] = 10000;

        admin = msg.sender;
        Assert.equal(
            0,
            balances[admin],
            "setup failed; admin should have no token balance"
        );

        assertError(
            Error.EQUITY_INSUFFICIENT_BALANCE,
            Error(_withdrawEquity(asset, 20000)),
            "large amount should have been rejected"
        );

        Assert.equal(10000, balances[asset], "cash should be unchanged");

        Assert.equal(0, balances[admin], "admin should have no token balance");
    }
}
