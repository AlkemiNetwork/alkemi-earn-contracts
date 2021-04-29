pragma solidity ^0.4.24;


contract RewardControl {

    uint constant public ALK_REWARDS_ISSUED_PER_BLOCK = 8.323820396;
    uint constant public TGE_REWARD_BLOCK_NUMBER = 1;
    uint constant public DOUBLE_SCALE = 1e10;
    // WBTC, ETH, DAI, USDC
    address[] constant public ALL_MARKETS = [0x0000000000000000000000000000000000000001, 0x0000000000000000000000000000000000000002, 0x0000000000000000000000000000000000000003, 0x0000000000000000000000000000000000000004];

    mapping(address => uint)  alreadyClaimedRewards;
    MoneyMarket moneyMarket; // Money Market Contract

    constructor() public {

    }

    // calculate accrued rewards since TGE block
    function calculateAccruedRewards(address holder) public view returns (uint) {
        uint totalAccruedRewards = 0;

        // calculate block number delta
        uint blockNumber = getBlockNumber();
        uint deltaBlocks = blockNumber - TGE_REWARD_BLOCK_NUMBER;

        if (deltaBlocks > 0) {
            for (uint i = 0; i < ALL_MARKETS.length; i++) {
                address currentMarket = ALL_MARKETS[i];

                // calculate rewards per block for lending and borrowing
                uint rewardsAllocationRatioForCurrentMarket = getRewardAllocationRatioForMarket(currentMarket); // 0.25
                uint marketTotalRewardsPerBlock = (ALK_REWARDS_ISSUED_PER_BLOCK * rewardsAllocationRatioForCurrentMarket); // 2.080955099
                uint marketLendersRewardsPerBlock = marketTotalRewardsPerBlock / 2; // 1.040477549
                uint marketBorrowsRewardsPerBlock = marketTotalRewardsPerBlock / 2; // 1.040477549

                // calculate lending rewards for the current market
                uint lenderCurrentMarketSupply = moneyMarket.getSupplyBalance(holder, currentMarket);
                uint totalCurrentMarketSupplyLiquidity = moneyMarket.markets[currentMarket].totalSupply;
                uint lenderALKRewardsPerBlockRatio = lenderCurrentMarketSupply / totalCurrentMarketSupplyLiquidity; // 0.4
                uint lenderALKRewardsPerBlock = marketLendersRewardsPerBlock * lenderALKRewardsPerBlockRatio; // 0.4161910198
                lenderAccruedRewardsForCurrentMarket = (deltaBlocks * lenderALKRewardsPerBlock);

                // calculate borrowing rewards for the current market
                uint borrowCurrentMarketSupply = moneyMarket.getBorrowBalance(holder, currentMarket);
                uint totalCurrentMarketBorrowLiquidity = moneyMarket.markets[currentMarket].totalBorrows;
                uint borrowALKRewardsPerBlockRatio = borrowCurrentMarketSupply / totalCurrentMarketBorrowLiquidity; // 0.4
                uint borrowALKRewardsPerBlock = marketBorrowsRewardsPerBlock * borrowALKRewardsPerBlockRatio; // 0.4161910198
                borrowerAccruedRewardsForCurrentMarket = deltaBlocks * borrowALKRewardsPerBlock;

                // accumulate current market rewards
                totalAccruedRewards = totalAccruedRewards + lenderAccruedRewardsForCurrentMarket + borrowerAccruedRewardsForCurrentMarket;
            }
        }

        return totalAccruedRewards;
    }

    function calculateUnclaimedRewards(address holder) public view returns (uint) {
        uint accruedRewards = calculateAccruedRewards(holder);
        if (accruedRewards > 0 && accruedRewards > alreadyClaimedRewards[holder]) {
            return accruedRewards - alreadyClaimedRewards[holder];
        }
        return 0;
    }

    function claimRewards(address holder, uint claimedAmount) public {
        uint unclaimedRewards = calculateUnclaimedRewards(holder);
        require(unclaimedRewards >= claimedAmount, "The unclaimed rewards must be greater than or equal to the given claimed amount");
        alreadyClaimedRewards[holder] = alreadyClaimedRewards[holder] + claimedAmount;
        transferRewards(holder, claimedAmount);
    }


    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    function getRewardAllocationRatioForMarket(address market) internal returns (uint) {// return 0.25
        uint totalLiquidity = 0;
        for (uint i = 0; i < ALL_MARKETS.length; i++) {
            Market currentMarket = moneyMarket.markets[ALL_MARKETS[i]];
            totalLiquidity = totalLiquidity + currentMarket.totalSupply + currentMarket.totalBorrows;
        }
        Market targetMarket = moneyMarket.markets[market];
        return (targetMarket.totalSupply + targetMarket.totalBorrows) / totalLiquidity ;
    }

    function transferRewards(address holder, uint amount) internal {
        // @TODO
    }

}