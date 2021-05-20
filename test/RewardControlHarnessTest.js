"use strict";

const {deployMockContract, MockProvider, solidity, deployContract} = require('ethereum-waffle');
const {expect, use} = require('chai');
const MoneyMarket = require('../build/contracts/MoneyMarket.json');
const RewardControl = require('../build/contracts/RewardControlHarness.json');

use(solidity);

contract('RewardControl', function ([root, ...accounts]) {
    const GAS_PRICE = 20000000000
    const GAS_LIMIT = 6721975

    describe.skip("#refreshAlkSpeeds", async () => {
        it("refresh ALK speeds when there is a single market", async () => {
            const [a, b, c, d] = new MockProvider().getWallets();
            let mockMoneyMarket = await deployMockContract(a, MoneyMarket.abi);
            await mockMoneyMarket.mock.markets.returns(true, 0, d.address, 100, 0, 0, 100, 0, 0);
            let rewardControl = await deployContract(a, RewardControl);
            await rewardControl.initializer(a.address, mockMoneyMarket.address, b.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(c.address, {gasPrice: GAS_PRICE});
            await rewardControl.harnessRefreshAlkSpeeds({gasPrice: GAS_PRICE});
            let alkSpeed = await rewardControl.alkSpeeds(c.address, {gasPrice: GAS_PRICE});
            expect(alkSpeed.toString()).to.equals("4161910200000000000", "ALK speed of a solely market should be according to ALK rate");
        });

        it("refresh ALK speeds when there are two markets with the same alloc", async () => {
            const [a, b, c, d] = new MockProvider().getWallets();
            let mockMoneyMarket = await deployMockContract(a, MoneyMarket.abi);
            await mockMoneyMarket.mock.markets.withArgs(c.address).returns(true, 0, d.address, 100, 0, 0, 100, 0, 0);
            await mockMoneyMarket.mock.markets.withArgs(d.address).returns(true, 0, d.address, 100, 0, 0, 100, 0, 0);
            let rewardControl = await deployContract(a, RewardControl);
            await rewardControl.initializer(a.address, mockMoneyMarket.address, b.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(c.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(d.address, {gasPrice: GAS_PRICE});
            await rewardControl.harnessRefreshAlkSpeeds({gasPrice: GAS_PRICE});
            let dAlkSpeed = await rewardControl.alkSpeeds(c.address, {gasPrice: GAS_PRICE});
            expect(dAlkSpeed.toString()).to.equals("2080955100000000000", "ALK speed of market d should be half of ALK rate");
            let eAlkSpeed = await rewardControl.alkSpeeds(d.address, {gasPrice: GAS_PRICE});
            expect(eAlkSpeed.toString()).to.equals("2080955100000000000", "ALK speed of market e should be half of ALK rate");
        });

        it("refresh ALK speeds when there are two markets with different alloc", async () => {
            const [a, b, c, d] = new MockProvider().getWallets();
            let mockMoneyMarket = await deployMockContract(a, MoneyMarket.abi);
            await mockMoneyMarket.mock.markets.withArgs(c.address).returns(true, 0, d.address, 100, 0, 0, 100, 0, 0);
            await mockMoneyMarket.mock.markets.withArgs(d.address).returns(true, 0, d.address, 150, 0, 0, 150, 0, 0);
            let rewardControl = await deployContract(a, RewardControl);
            await rewardControl.initializer(a.address, mockMoneyMarket.address, b.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(c.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(d.address, {gasPrice: GAS_PRICE});
            await rewardControl.harnessRefreshAlkSpeeds({gasPrice: GAS_PRICE});
            let dAlkSpeed = await rewardControl.alkSpeeds(c.address, {gasPrice: GAS_PRICE});
            expect(dAlkSpeed.toString()).to.equals("1664764080000000000", "ALK speed of market d should be half of ALK rate");
            let eAlkSpeed = await rewardControl.alkSpeeds(d.address, {gasPrice: GAS_PRICE});
            expect(eAlkSpeed.toString()).to.equals("2497146120000000000", "ALK speed of market e should be half of ALK rate");
        });
    });

    describe("#updateAlkSupplyIndex", async () => {
        it("update supply state on the first time successfully", async () => {
            const [a, b, market, d] = new MockProvider({
                ganacheOptions: {
                    accounts: [
                        {balance: '100000000000000000000', secretKey: '0xfc2ffa36bff0d299f8e6651b760a8e5f936eda9379bce946671f37cbb073551e'},
                        {balance: '100000000000000000000', secretKey: '0xfa78e6f852159c30cb5b777ff3bfb0a001b5c6e3729ea67e28c6c8d21ac93209'},
                        {balance: '100000000000000000000', secretKey: '0xf78cdf3ddeaf13c5f6f75240a196dd416f703478ea31da8d0ae6b04e7a10da8d'},
                        {balance: '100000000000000000000', secretKey: '0x90cd3cd694985c33b83335c70f4c1d23c72c9ea3fe182ed552e6611c2b70a990'},
                        ] // 100 ETH
                }
            }).getWallets();
            let mockMoneyMarket = await deployMockContract(a, MoneyMarket.abi);
            let totalSupply = 100;
            await mockMoneyMarket.mock.markets.returns(true, 0, d.address, totalSupply, 0, 0, 0, 0, 0);
            let rewardControl = await deployContract(a, RewardControl);
            // await rewardControl.initializer(a.address, mockMoneyMarket.address, b.address, {gasPrice: GAS_PRICE});
            // await rewardControl.addMarket(market.address, {gasPrice: GAS_PRICE});
            await rewardControl.harnessSetBlockNumber(1, {gasPrice: GAS_PRICE});
            await rewardControl.harnessSetAlkSpeed(market.address, BigInt("4161910200000000000"), {gasPrice: GAS_PRICE});
            await rewardControl.harnessUpdateAlkSupplyIndex(market.address, {gasPrice: GAS_PRICE, gasLimit: GAS_LIMIT});
            /*let supplyState = await rewardControl.alkSupplyState(market.address, {gasPrice: GAS_PRICE, gasLimit: GAS_LIMIT});
            console.log(supplyState);*/
        });
    });

});