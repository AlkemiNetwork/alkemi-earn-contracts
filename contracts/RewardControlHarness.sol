pragma solidity ^0.4.24;

import "../contracts/RewardControl.sol";

contract RewardControlHarness is RewardControl {
    uint blockNumber = 100000;
    mapping(address => uint) mockedMarketTotalSupply;
    mapping(address => uint) mockedMarketTotalBorrows;

    function harnessRefreshAlkSpeeds() public {
        refreshAlkSpeeds();
    }

    function harnessUpdateAlkSupplyIndex(address market) public {
        updateAlkSupplyIndex(market);
    }

    function getBlockNumber() public view returns (uint) {
        return blockNumber;
    }

    function harnessSetBlockNumber(uint newBlockNumber) public {
        blockNumber = newBlockNumber;
    }

    function harnessFastForward(uint blocks) public {
        blockNumber += blocks;
    }

    function harnessSetAlkSpeed(address market, uint speed) public {
        alkSpeeds[market] = speed;
    }

    function harnessSetAlkSupplyState(address market, uint224 _index, uint32 _block) public {
        alkSupplyState[market] = MarketState({index : _index, block : _block});
    }

    function harnessSetMarketTotalSupply(address market, uint totalSupply) public {
        mockedMarketTotalSupply[market] = totalSupply;
    }

    function harnessSetMarketTotalBorrows(address market, uint totalBorrows) public {
        mockedMarketTotalBorrows[market] = totalBorrows;
    }

    function getMarketTotalSupply(address market) public view returns (uint) {
        return mockedMarketTotalSupply[market];
    }

    function getMarketTotalBorrows(address market) public view returns (uint) {
        return mockedMarketTotalBorrows[market];
    }

}