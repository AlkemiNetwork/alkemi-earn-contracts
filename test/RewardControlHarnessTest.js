"use strict";

// import {deployMockContract, MockProvider, solidity, deployContract} from 'ethereum-waffle';
// import {expect, use} from 'chai';
// import MoneyMarket from '../build/MoneyMarket.json'
// import RewardControl from '../build/RewardControlHarness.json'
const {deployMockContract, MockProvider, solidity, deployContract} = require('ethereum-waffle');
const {expect, use} = require('chai');
const MoneyMarket = require('../build/contracts/MoneyMarket.json');
const RewardControl = require('../build/contracts/RewardControlHarness.json');

const {gas} = require('./Utils');
const {getContract} = require('./Contract');
// const RewardControl = getContract("./RewardControlHarness.sol");

use(solidity);

contract('RewardControl', function ([root, ...accounts]) {
    const GAS_PRICE = 100000000

    describe("#refreshAlkSpeeds", async () => {
        it("refresh ALK speeds when there is a single market", async () => {
            /*const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[0], accounts[1]).send({gas: 1000000, from: root})
            await rewardControl.methods.addMarket(accounts[2]).send({gas: 1000000, from: root})
            await rewardControl.methods.harnessRefreshAlkSpeeds().send({gas: 1000000, from: root});*/
            const [a, b, c, d, e] = new MockProvider().getWallets();
            let mockMoneyMarket = await deployMockContract(a, MoneyMarket.abi);
            await mockMoneyMarket.mock.markets.returns(true, 0, e.address, 100, 0, 0, 100, 0, 0);
            let rewardControl = await deployContract(a, RewardControl);
            await rewardControl.initializer(a.address, mockMoneyMarket.address, c.address, {gasPrice: GAS_PRICE});
            await rewardControl.addMarket(d.address, {gasPrice: GAS_PRICE});
            await rewardControl.harnessRefreshAlkSpeeds({gasPrice: GAS_PRICE});
            let alkSpeed = await rewardControl.alkSpeeds(d.address, {gasPrice: GAS_PRICE});
            expect(alkSpeed.toString()).to.equals("8323820396000000000","ALK speed of a solely market should be according to ALK rate");
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
            expect(dAlkSpeed.toString()).to.equals("4161910198000000000","ALK speed of market d should be half of ALK rate");
            let eAlkSpeed = await rewardControl.alkSpeeds(d.address, {gasPrice: GAS_PRICE});
            expect(eAlkSpeed.toString()).to.equals("4161910198000000000","ALK speed of market e should be half of ALK rate");
        });
    });

});
