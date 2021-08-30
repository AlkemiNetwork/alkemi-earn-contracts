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

    function harnessUpdateAlkSupplyIndex(address market, bool isVerified) public {
        updateAlkSupplyIndex(market,isVerified);
    }

    function harnessUpdateAlkBorrowIndex(address market, bool isVerified) public {
        updateAlkBorrowIndex(market,isVerified);
    }

    function harnessDistributeSupplierAlk(address market, address supplier, bool isVerified)
        public
    {
        distributeSupplierAlk(market, supplier,isVerified);
    }

    function harnessDistributeBorrowerAlk(address market, address borrower, bool isVerified)
        public
    {
        distributeBorrowerAlk(market, borrower,isVerified);
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

    function harnessSetAlkSpeed(address market, uint256 speed, bool isVerified) public {
        alkSpeeds[isVerified][market] = speed;
    }

    function harnessSetAlkSupplyState(
        address market,
        uint224 _index,
        uint32 _block,
        bool isVerified
    ) public {
        alkSupplyState[isVerified][market] = MarketState({index: _index, block: _block});
    }

    function harnessSetAlkBorrowState(
        address market,
        uint224 _index,
        uint32 _block,
        bool isVerified
    ) public {
        alkBorrowState[isVerified][market] = MarketState({index: _index, block: _block});
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
        uint256 index,
        bool isVerified
    ) public {
        alkSupplierIndex[isVerified][market][supplier] = index;
    }

    function harnessSetAlkBorrowerIndex(
        address market,
        address borrower,
        uint256 index,
        bool isVerified
    ) public {
        alkBorrowerIndex[isVerified][market][borrower] = index;
    }

    function harnessTransferAlk(address participant, uint256 participantAccrued, address market, bool isVerified)
        public
        returns (uint256)
    {
        transferAlk(participant, participantAccrued, market, isVerified);
    }

    function harnessGetNumberOfMarkets(bool isVerified) public view returns (uint256) {
        return allMarkets[isVerified].length;
    }
}
