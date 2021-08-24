pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/**
 * @dev This tests the Alkemi Earn Verified with tests for _withdrawEquity part 4.
 */
contract AlkemiEarnVerifiedTest_WithdrawEquity4 is AlkemiEarnVerifiedTest {
    function testWithdrawEquity_OverflowCashPlusBorrows() public {
        initializer();
        _changeKYCAdmin(msg.sender,true);
        _changeCustomerKYC(msg.sender,true);
        address asset = address(this);
        address protocol = address(this);
        balances[protocol] = 10000;

        admin = msg.sender;
        Assert.equal(
            0,
            balances[admin],
            "setup failed; admin should have no token balance"
        );

        markets[asset].totalSupply = 10;
        markets[asset].totalBorrows = (2**256) - 1;

        _withdrawEquity(asset, 1);

        Assert.equal(10000, balances[protocol], "cash should be unchanged");
        Assert.equal(
            10,
            markets[asset].totalSupply,
            "totalSupply should be unchanged"
        );
        Assert.equal(
            (2**256) - 1,
            markets[asset].totalBorrows,
            "totalBorrows should be unchanged"
        );

        Assert.equal(0, balances[admin], "admin should have no token balance");
    }

    function testWithdrawEquity_UnderflowEquity() public {
        address asset = address(this);
        address protocol = address(this);
        balances[protocol] = 10000;

        admin = msg.sender;
        Assert.equal(
            0,
            balances[admin],
            "setup failed; admin should have no token balance"
        );

        markets[asset].totalSupply = (2**256) - 2;
        markets[asset].totalBorrows = 1;

        _withdrawEquity(asset, 1);

        Assert.equal(10000, balances[protocol], "cash should be unchanged");
        Assert.equal(
            (2**256) - 2,
            markets[asset].totalSupply,
            "totalSupply should be unchanged"
        );
        Assert.equal(
            1,
            markets[asset].totalBorrows,
            "totalBorrows should be unchanged"
        );

        Assert.equal(0, balances[admin], "admin should have no token balance");
    }
}
