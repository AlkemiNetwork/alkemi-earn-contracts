pragma solidity ^0.4.24;

import "../contracts/RewardControl.sol";

contract RewardControlHarness is RewardControl {

    function harnessRefreshAlkSpeeds() public {
        refreshAlkSpeeds();
    }

}