pragma solidity ^0.4.24;

import "../contracts/RewardControl.sol";

contract RewardControlHarness is RewardControl {
    uint blockNumber = 100000;
    mapping(address => uint) mockedMarketTotalSupply;
    mapping(address => uint) mockedMarketTotalBorrows;
    mapping(address => mapping(address => uint)) mockedSupplyBalance;
    mapping(address => mapping(address => uint)) mockedBorrowBalance;

    function harnessRefreshAlkSpeeds() public {
        refreshAlkSpeeds();
    }

    function harnessUpdateAlkSupplyIndex(address market) public {
        updateAlkSupplyIndex(market);
    }

    function harnessUpdateAlkBorrowIndex(address market) public {
        updateAlkBorrowIndex(market);
    }

    function harnessDistributeSupplierAlk(address market, address supplier) public {
        distributeSupplierAlk(market, supplier);
    }

    function harnessDistributeBorrowerAlk(address market, address borrower) public {
        distributeBorrowerAlk(market, borrower);
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

    function harnessSetAlkBorrowState(address market, uint224 _index, uint32 _block) public {
        alkBorrowState[market] = MarketState({index : _index, block : _block});
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

    function harnessSetSupplyBalance(address market, address supplier, uint supplyBalance) public {
        mockedSupplyBalance[market][supplier] = supplyBalance;
    }

    function harnessSetBorrowBalance(address market, address borrower, uint borrowBalance) public {
        mockedBorrowBalance[market][borrower] = borrowBalance;
    }

    function getSupplyBalance(address market, address supplier) public view returns (uint) {
        return mockedSupplyBalance[market][supplier];
    }

    function getBorrowBalance(address market, address borrower) public view returns (uint) {
        return mockedBorrowBalance[market][borrower];
    }

    function harnessSetAlkSupplierIndex(address market, address supplier, uint index) public {
        alkSupplierIndex[market][supplier] = index;
    }

    function harnessSetAlkBorrowerIndex(address market, address borrower, uint index) public {
        alkBorrowerIndex[market][borrower] = index;
    }

}