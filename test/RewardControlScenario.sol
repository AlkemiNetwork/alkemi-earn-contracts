pragma solidity ^0.4.24;

import "../contracts/RewardControl.sol";

contract RewardControlScenario is RewardControl {
    uint256 blockNumber;

    function getBlockNumber() public view returns (uint256) {
        return blockNumber;
    }

    function harnessSetBlockNumber(uint256 newBlockNumber) public {
        blockNumber = newBlockNumber;
    }

    function harnessFastForward(uint256 blocks) public {
        blockNumber += blocks;
    }
}
