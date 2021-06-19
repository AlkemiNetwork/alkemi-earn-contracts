pragma solidity ^0.4.24;

import "../contracts/RewardControl.sol";

contract RewardControlScenario is RewardControl {
    uint blockNumber;

    function getBlockNumber() public view returns (uint) {
        return blockNumber;
    }

    function harnessSetBlockNumber(uint newBlockNumber) public {
        blockNumber = newBlockNumber;
    }

    function harnessFastForward(uint blocks) public {
        blockNumber += blocks;
    }

}