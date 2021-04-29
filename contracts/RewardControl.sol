pragma solidity ^0.4.24;


contract RewardControl {

    uint ALK_REWARDS_ISSUED_PER_BLOCK = 8.323820396;
    uint TGE_REWARD_BLOCK_NUMBER = 100;
    MoneyMarket moneyMarket;
    address[] allMarkets = [WBTC, DAI, ETH, USDC];
    mapping(address => uint)  alreadyClaimALKForLender;
    mapping(address => uint)  alreadyClaimALKForBorrower;
    mapping(address => mapping(address => uint))  alreadyClaimALKByHolderByMarketForLender;
    mapping(address => mapping(address => uint))  alreadyClaimALKByHolderByMarketForBorrower;

    constructor() public {

    }

    function calculateAccruedRewards(address holder) public view returns(uint) {
        // @TODO
        uint alkAccrued = 0
        Market[] markets = allMarkets
        for (uint i = 0; i < markets.length; i++) {
            Market currentMarket = markets[i];
            require(isMarketSupport(currentMarket), "market must be launched in reward program");
            // claim lending rewards

            uint rewardsAllocationRatioForTheMarket = getRewardAllocationRatioForMarkets(currentMarket); // 25
            uint marketTotalRewardsPerBlock = rewards(ALK_REWARDS_ISSUED_PER_BLOCK * rewardsAllocationRatioForTheMarket) / 100; // 2.080955099
            uint marketLendersRewardsPerBlock = marketTotalRewardsPerBlock / 2; // 1.040477549
            uint marketBorrowsRewardsPerBlock = marketTotalRewardsPerBlock / 2; // 1.040477549

            // calculate block number delta
            uint blockNumber = getBlockNumber();
            uint deltaBlocks = blockNumber - TGE_REWARD_BLOCK_NUMBER;

            if (deltaBlocks > 0) {
                // calculate lending rewards
                uint lenderCurrentMarketSupply = moneyMarket.getSupplyBalance(holder, currentMarket);
                uint totalCurrentMarketSupplyLiquidity = moneyMarket.markets[currentMarket].totalSupply;
                uint lenderALKRewardsPerBlockRatio = lenderCurrentMarketSupply / totalCurrentMarketSupplyLiquidity; // 40
                uint lenderALKRewardsPerBlock = (marketLendersRewardsPerBlock * lenderALKRewardsPerBlockRatio) / 100; // 0.4161910198
                uint alkUnclaimedForLender = 0;

                alkAccruedForLender = deltaBlocks * lenderALKRewardsPerBlock;

                // calculate borrowing rewards
                uint borrowCurrentMarketSupply = moneyMarket.getBorrowBalance(holder, currentMarket);
                uint totalCurrentMarketBorrowLiquidity = moneyMarket.markets[currentMarket].totalBorrows;
                uint borrowALKRewardsPerBlockRatio = borrowCurrentMarketSupply / totalCurrentMarketBorrowLiquidity; // 40
                uint borrowALKRewardsPerBlock = (marketBorrowsRewardsPerBlock * borrowALKRewardsPerBlockRatio) / 100; // 0.4161910198
                uint alkUnclaimedForBorrower = 0;

                alkAccruedForBorrower = deltaBlocks * borrowALKRewardsPerBlock;

                alkAccrued = alkAccrued + alkAccruedForLender + alkAccruedForBorrower;
            }
        }

        return alkAccrued;
    }

    function calculateUnclaimedRewards(address holder) public view returns(uint) {
        // @TODO
        uint alkAccrued = calculateAccruedRewards(holder);

        return alkAccrued - alkAlreadyClaimedReward[holder];
    }

    function claimReward(address holder, uint claimAmount) public {
        uint unclaimedReward = calculateUnclaimedRewards
        require(accruedReward - alkAlreadyClaimedReward > claimAmount , "The given reward amount cannot more than unclaimedReward") ;
//@TODO


        transferALKRewards(holder, rewardAmount);
    }



    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    function getRewardAllocationRatioForMarkets(address market) internal returns (uint) {// return 25
        uint totalLiquidity = 0;
        for (uint i = 0; i < allMarkets.length; i++) {
            Market currentMarket = moneyMarket.markets[allMarkets[i]]; // call MoneyMarket contract
            totalLiquidity = totalLiquidity + currentMarket.totalSupply + currentMarket.totalBorrows;
        }
        Market targetMarket = moneyMarket.markets[market]; // call MoneyMarket contract
        return (targetMarket.totalSupply + targetMarket.totalBorrows) / totalLiquidity;
    }

}