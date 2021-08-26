pragma solidity ^0.4.24;

import "./RewardControlHarness.sol";

contract RewardControlHarnessV2 is RewardControlHarness {
    uint256 value;

    function getValue() public view returns (uint256) {
        return value;
    }

    function setValue(uint256 _value) public {
        value = _value;
    }
}
