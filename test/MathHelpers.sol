pragma solidity ^0.4.24;

contract MathHelpers {
    /*
     * @dev Creates a number like 15e16 as a uint256 from scientific(15, 16).
     */
    function scientific(uint256 val, uint256 expTen)
        internal
        pure
        returns (uint256)
    {
        return val * (10**expTen);
    }
}
