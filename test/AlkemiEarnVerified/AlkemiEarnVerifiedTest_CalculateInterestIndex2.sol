pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AlkemiEarnVerifiedTest.sol";

/*
 * @dev This tests the Alkemi Earn Verified with tests for calculateInterestIndex, part 2
 */
contract AlkemiEarnVerifiedTest_CalculateInterestIndex2 is
    AlkemiEarnVerifiedTest
{
    function testCalculateInterestIndex_LargeInterest() public {
        uint256 startingInterestIndex = 10**18;

        (Error err0, Exp memory interestRate) = getExp(5, 21024000); // 50% (0.5) annual interest / 2102400 blocks per year
        assertNoError(err0);

        uint256 blockStart = 0;
        uint256 blockEnd = 50000000; // 50MM blocks is about 23 years

        (Error err1, uint256 newInterestIndex) = calculateInterestIndex(
            startingInterestIndex,
            interestRate.mantissa,
            blockStart,
            blockEnd
        );
        assertNoError(err1);

        // This is `1000000000000000000 * (1 + 50000000 * 5/21024000) with discrete math`
        Assert.equal(
            12891171993900000000,
            newInterestIndex,
            "should have correct index"
        );
    }

    function testCalculateInterestIndex_BackOfEnvelopeSmallInterest() public {
        (Error err0, Exp memory interestRate) = getExp(1, 210240000); // 1% (.01) annual interest / 2102400 blocks per year
        assertNoError(err0);

        uint256 startingInterestIndex = 10**18;

        uint256 blockStart = 0;
        uint256 blockEnd = 1;

        (Error err1, uint256 newInterestIndex) = calculateInterestIndex(
            startingInterestIndex,
            interestRate.mantissa,
            blockStart,
            blockEnd
        );
        assertNoError(err1);

        // This is `1000000000000000000 * (1 + 1 * 1/210240000) with discrete math`
        Assert.equal(
            1000000004756468797,
            newInterestIndex,
            "should have correct index"
        );
    }

    function testCalculateInterestIndex_BackOfEnvelopeLargeInterest() public {
        (Error err0, Exp memory interestRate) = getExp(1, 2102400); // 100% (1.0) annual interest / 2102400 blocks per year
        assertNoError(err0);

        uint256 startingInterestIndex = 10**18;

        uint256 blockStart = 0;
        uint256 blockEnd = 20000000;

        (Error err1, uint256 newInterestIndex) = calculateInterestIndex(
            startingInterestIndex,
            interestRate.mantissa,
            blockStart,
            blockEnd
        );
        assertNoError(err1);

        // This is `1000000000000000000 * (1 + 20000000 * 1/2102400) with discrete math`
        Assert.equal(
            10512937595120000000,
            newInterestIndex,
            "should have correct index"
        );
    }

    function testCalculateInterestIndex_InvalidBlockDelta() public {
        (Error err0, uint256 newInterestIndex) = calculateInterestIndex(
            0,
            0,
            10,
            5
        );
        assertError(
            Error.INTEGER_UNDERFLOW,
            err0,
            "should underflow block delta"
        );
        Assert.equal(0, newInterestIndex, "nil value");
    }

    function testCalculateInterestIndex_BlockDeltaRateOverflow() public {
        (Error err0, uint256 newInterestIndex) = calculateInterestIndex(
            0,
            10**77,
            10,
            20
        );
        assertError(
            Error.INTEGER_OVERFLOW,
            err0,
            "should overflow multiplication"
        );
        Assert.equal(0, newInterestIndex, "nil value");
    }

    function testCalculateInterestIndex_BlockDeltaRatePlusOneOverflow() public {
        (Error err0, uint256 newInterestIndex) = calculateInterestIndex(
            1,
            2**256 - 1,
            10,
            11
        );
        assertError(
            Error.INTEGER_OVERFLOW,
            err0,
            "should overflow multiplication plus one"
        );
        Assert.equal(0, newInterestIndex, "nil value");
    }

    function testCalculateInterestIndex_BlockDeltaRatePlusOneMulStartingIndexOverflow()
        public
    {
        (Error err0, uint256 newInterestIndex) = calculateInterestIndex(
            10**77,
            10,
            10,
            11
        );
        assertError(
            Error.INTEGER_OVERFLOW,
            err0,
            "should overflow multiplication to starting index"
        );
        Assert.equal(0, newInterestIndex, "nil value");
    }
}
