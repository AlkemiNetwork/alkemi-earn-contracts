pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "../../contracts/AlkemiEarnVerified.sol";
import "../AddressGenerator.sol";
import "../AssertHelpers.sol";
import "../MathHelpers.sol";
import "../EIP20NonStandardReturnHarness.sol";

/*
 * @dev This continues to test the money market, whose previous tests are full due to gas limits.
 */
contract AlkemiEarnVerifiedNonStandardTest is
    AlkemiEarnVerified,
    MathHelpers,
    AssertHelpers,
    EIP20NonStandardReturnHarness,
    AddressGenerator
{
    constructor()
        public
        EIP20NonStandardReturnHarness(0, "mmtestb", 18, "mmtestb")
    {}
}
