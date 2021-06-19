pragma solidity ^0.4.24;

import "./RewardControlHarness.sol";

contract RewardControlHarnessV2 is RewardControlHarness {
    uint value;

    function getValue() public view returns (uint256) {
        return value;
    }

    function setValue(uint _value) public {
        value = _value;
    }

}