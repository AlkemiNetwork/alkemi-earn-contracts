pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";
import "../MathHelpers.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for setOriginationFee.
 */
contract AlkemiEarnVerifiedTest_SetOriginationFee is AlkemiEarnVerifiedTest {
    /**
     * @dev helper that lets us create an Exp with `getExp` without cluttering our test code with error checks of the setup.
     */
    function getExpFromRational(uint256 numerator, uint256 denominator)
        internal
        returns (Exp memory)
    {
        (Error err, Exp memory result) = getExp(numerator, denominator);

        Assert.equal(0, uint256(err), "getExpFromRational failed");
        return result;
    }

    function testSetOriginationFee_NotAdmin() public {
        admin = address(0);

        Exp memory oldFee = originationFee;
        Exp memory newFee = getExpFromRational(3, 1);
        // Make sure newFee is different so our validation of the non-update is legitimate
        Assert.notEqual(
            newFee.mantissa,
            originationFee.mantissa,
            "setup failed; choose a different newFee"
        );

        assertError(
            Error.UNAUTHORIZED,
            Error(_adminFunctions(admin,admin,false,newFee.mantissa)),
            "should require admin rights"
        );

        Assert.equal(
            originationFee.mantissa,
            oldFee.mantissa,
            "origination fee should retain initial default value"
        );
    }

    function testSetOriginationFee_Success() public {
        admin = msg.sender;
        Exp memory newFee = getExpFromRational(3, 2);
        // Make sure newFee is different so our validation of the update is legitimate
        Assert.notEqual(
            newFee.mantissa,
            originationFee.mantissa,
            "setup failed; choose a different newFee"
        );

        assertNoError(Error(_adminFunctions(admin,admin,false,newFee.mantissa)));

        Assert.equal(
            originationFee.mantissa,
            newFee.mantissa,
            "origination fee should have been updated"
        );
    }

    function testSetOriginationFee_ZeroSuccess() public {
        admin = msg.sender;
        Exp memory oldFee = getExpFromRational(1, 100);
        originationFee = oldFee;

        Exp memory newFee = getExpFromRational(0, 100);
        // Make sure newFee is different so our validation of the non-update is legitimate
        Assert.notEqual(
            newFee.mantissa,
            originationFee.mantissa,
            "setup failed; choose a different newFee"
        );

        assertNoError(Error(_adminFunctions(admin,admin,false,newFee.mantissa)));

        Assert.equal(
            originationFee.mantissa,
            newFee.mantissa,
            "origination fee should be zero"
        );
    }
}
