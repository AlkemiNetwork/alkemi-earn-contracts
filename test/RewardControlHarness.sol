pragma solidity ^0.4.24;

import "../contracts/RewardControl.sol";

contract RewardControlHarness is RewardControl {
    uint256 blockNumber;
    mapping(address => uint256) mockedMarketTotalSupply;
    mapping(address => uint256) mockedMarketTotalBorrows;
    mapping(address => mapping(address => uint256)) mockedSupplyBalance;
    mapping(address => mapping(address => uint256)) mockedBorrowBalance;

    function harnessRefreshAlkSpeeds() public {
        refreshAlkSpeeds();
    }

    function harnessUpdateAlkSupplyIndex(address market) public {
        updateAlkSupplyIndex(market);
    }

    function harnessUpdateAlkBorrowIndex(address market) public {
        updateAlkBorrowIndex(market);
    }

    function harnessDistributeSupplierAlk(address market, address supplier)
        public
    {
        distributeSupplierAlk(market, supplier);
    }

    function harnessDistributeBorrowerAlk(address market, address borrower)
        public
    {
        distributeBorrowerAlk(market, borrower);
    }

    function getBlockNumber() public view returns (uint256) {
        return blockNumber;
    }

    function harnessSetBlockNumber(uint256 newBlockNumber) public {
        blockNumber = newBlockNumber;
    }

    function harnessFastForward(uint256 blocks) public {
        blockNumber += blocks;
    }

    function harnessSetAlkSpeed(address market, uint256 speed) public {
        alkSpeeds[market] = speed;
    }

    function harnessSetAlkSupplyState(
        address market,
        uint224 _index,
        uint32 _block
    ) public {
        alkSupplyState[market] = MarketState({index: _index, block: _block});
    }

    function harnessSetAlkBorrowState(
        address market,
        uint224 _index,
        uint32 _block
    ) public {
        alkBorrowState[market] = MarketState({index: _index, block: _block});
    }

    function harnessSetMarketTotalSupply(address market, uint256 totalSupply)
        public
    {
        mockedMarketTotalSupply[market] = totalSupply;
    }

    function harnessSetMarketTotalBorrows(address market, uint256 totalBorrows)
        public
    {
        mockedMarketTotalBorrows[market] = totalBorrows;
    }

    function getMarketTotalSupply(address market)
        public
        view
        returns (uint256)
    {
        return mockedMarketTotalSupply[market];
    }

    function getMarketTotalBorrows(address market)
        public
        view
        returns (uint256)
    {
        return mockedMarketTotalBorrows[market];
    }

    function harnessSetSupplyBalance(
        address market,
        address supplier,
        uint256 supplyBalance
    ) public {
        mockedSupplyBalance[market][supplier] = supplyBalance;
    }

    function harnessSetBorrowBalance(
        address market,
        address borrower,
        uint256 borrowBalance
    ) public {
        mockedBorrowBalance[market][borrower] = borrowBalance;
    }

    function getSupplyBalance(address market, address supplier)
        public
        view
        returns (uint256)
    {
        return mockedSupplyBalance[market][supplier];
    }

    function getBorrowBalance(address market, address borrower)
        public
        view
        returns (uint256)
    {
        return mockedBorrowBalance[market][borrower];
    }

    function harnessSetAlkSupplierIndex(
        address market,
        address supplier,
        uint256 index
    ) public {
        alkSupplierIndex[market][supplier] = index;
    }

    function harnessSetAlkBorrowerIndex(
        address market,
        address borrower,
        uint256 index
    ) public {
        alkBorrowerIndex[market][borrower] = index;
    }

    function harnessTransferAlk(address participant, uint256 participantAccrued)
        public
        returns (uint256)
    {
        transferAlk(participant, participantAccrued);
    }

    function harnessGetNumberOfMarkets() public view returns (uint256) {
        return allMarkets.length;
    }
}
