pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "../contracts/ErrorReporter.sol";

contract AssertHelpers is ErrorReporter {
    function assertError(
        Error expected,
        Error given,
        string message
    ) internal {
        Assert.equal(uint256(expected), uint256(given), message);
    }

    function assertNoError(Error err) internal {
        assertError(Error.NO_ERROR, err, "should have error NO_ERROR");
    }

    function assertZero(uint256 value, string message) internal {
        Assert.equal(0, value, message);
    }
}
