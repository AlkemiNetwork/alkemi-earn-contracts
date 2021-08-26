pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for repayBorrow.
 */
contract AlkemiEarnVerifiedTest_RepayBorrow is AlkemiEarnVerifiedTest {
    function testRepayBorrow_basicValidations() public {
        address token = address(this); // must be this
        address protocol = address(this); // must be this
        initializer();
        _changeKYCAdmin(msg.sender, true);
        _changeCustomerKYC(msg.sender, true);

        // Set a borrow balance for the user
        markets[token].borrowIndex = 1;
        markets[token].borrowRateMantissa = 0;
        borrowBalances[msg.sender][token] = Balance({
            principal: 15,
            interestIndex: 1
        });

        // Repay too much
        uint256 err = repayBorrow(token, 16);
        Assert.equal(
            uint256(Error.INTEGER_UNDERFLOW),
            err,
            "should have returned Error.INTEGER_UNDERFLOW"
        );

        // Repay without approval
        err = repayBorrow(token, 10);
        Assert.equal(
            uint256(Error.TOKEN_INSUFFICIENT_ALLOWANCE),
            err,
            "should have returned Error.TOKEN_INSUFFICIENT_ALLOWANCE"
        );

        approve(protocol, 20); // allowed[customer][protocol] = 20; is not working. why not?

        // Repay without funds
        err = repayBorrow(token, 10);
        Assert.equal(
            uint256(Error.TOKEN_INSUFFICIENT_BALANCE),
            err,
            "should have returned Error.TOKEN_INSUFFICIENT_BALANCE"
        );
    }
}
