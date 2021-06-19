pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "../../contracts/AlkemiEarnVerified.sol";
import "../AddressGenerator.sol";
import "../AssertHelpers.sol";
import "../MathHelpers.sol";
import "../EIP20Harness.sol";

/*
 * @dev This continues to test the Alkemi Earn Verified, whose previous tests are full due to gas limits.
 */
contract AlkemiEarnVerifiedTest is
    AlkemiEarnVerified,
    MathHelpers,
    AssertHelpers,
    EIP20Harness,
    AddressGenerator
{
    constructor() public EIP20Harness(0, "mmtestb", 18, "mmtestb") {}
}
