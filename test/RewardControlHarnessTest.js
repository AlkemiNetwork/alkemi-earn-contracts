"use strict";

const {deployMockContract, MockProvider, solidity, deployContract} = require('ethereum-waffle');
const {expect, use} = require('chai');
const MoneyMarket = require('../build/contracts/MoneyMarket.json');
const RewardControl = require('../build/contracts/RewardControlHarness.json');

use(solidity);

contract('RewardControl', function ([root, ...accounts]) {
    const GAS_PRICE = 100000000

    describe("#refreshAlkSpeeds", async () => {
        it("refresh ALK speeds when there is a single market", async () => {
            const [a, b, c, d, e] = new MockProvider().getWallets();
            let mockMoneyMarket = await deployMockContract(a, MoneyMarket.abi);
            await mockMoneyMarket.mock.markets.returns(true, 0, e.address, 100, 0, 0, 100, 0, 0);
            let rewardControl = await deployContract(a, RewardControl);
            await rewardControl.initializer(a.address, mockMoneyMarket.address, c.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(d.address, {gasPrice: GAS_PRICE});
            await rewardControl.harnessRefreshAlkSpeeds({gasPrice: GAS_PRICE});
            let alkSpeed = await rewardControl.alkSpeeds(d.address, {gasPrice: GAS_PRICE});
            expect(alkSpeed.toString()).to.equals("4161910200000000000", "ALK speed of a solely market should be according to ALK rate");
        });

        it("refresh ALK speeds when there are two markets with the same alloc", async () => {
            const [a, b, c, d, e] = new MockProvider().getWallets();
            let mockMoneyMarket = await deployMockContract(a, MoneyMarket.abi);
            await mockMoneyMarket.mock.markets.withArgs(d.address).returns(true, 0, e.address, 100, 0, 0, 100, 0, 0);
            await mockMoneyMarket.mock.markets.withArgs(e.address).returns(true, 0, e.address, 100, 0, 0, 100, 0, 0);
            let rewardControl = await deployContract(a, RewardControl);
            await rewardControl.initializer(a.address, mockMoneyMarket.address, c.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(d.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(e.address, {gasPrice: GAS_PRICE});
            await rewardControl.harnessRefreshAlkSpeeds({gasPrice: GAS_PRICE});
            let dAlkSpeed = await rewardControl.alkSpeeds(d.address, {gasPrice: GAS_PRICE});
            expect(dAlkSpeed.toString()).to.equals("2080955100000000000", "ALK speed of market d should be half of ALK rate");
            let eAlkSpeed = await rewardControl.alkSpeeds(e.address, {gasPrice: GAS_PRICE});
            expect(eAlkSpeed.toString()).to.equals("2080955100000000000", "ALK speed of market e should be half of ALK rate");
        });

        it("refresh ALK speeds when there are two markets with different alloc", async () => {
            const [a, b, c, d, e] = new MockProvider().getWallets();
            let mockMoneyMarket = await deployMockContract(a, MoneyMarket.abi);
            await mockMoneyMarket.mock.markets.withArgs(d.address).returns(true, 0, e.address, 100, 0, 0, 100, 0, 0);
            await mockMoneyMarket.mock.markets.withArgs(e.address).returns(true, 0, e.address, 150, 0, 0, 150, 0, 0);
            let rewardControl = await deployContract(a, RewardControl);
            await rewardControl.initializer(a.address, mockMoneyMarket.address, c.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(d.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(e.address, {gasPrice: GAS_PRICE});
            await rewardControl.harnessRefreshAlkSpeeds({gasPrice: GAS_PRICE});
            let dAlkSpeed = await rewardControl.alkSpeeds(d.address, {gasPrice: GAS_PRICE});
            expect(dAlkSpeed.toString()).to.equals("1664764080000000000", "ALK speed of market d should be half of ALK rate");
            let eAlkSpeed = await rewardControl.alkSpeeds(e.address, {gasPrice: GAS_PRICE});
            expect(eAlkSpeed.toString()).to.equals("2497146120000000000", "ALK speed of market e should be half of ALK rate");
        });
    });

});
