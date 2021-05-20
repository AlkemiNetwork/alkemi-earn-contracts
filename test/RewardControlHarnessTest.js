"use strict";

const {gas} = require('./Utils');
const {getContract} = require('./Contract');
const RewardControl = getContract("./RewardControlHarness.sol");

contract('RewardControlHarness', function ([root, ...accounts]) {

    describe.skip("#refreshAlkSpeeds", async () => {
        it("refresh ALK speeds when there is a single market", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(accounts[1]).send({gas: 1000000, from: root});
            await rewardControl.methods.harnessSetMarketTotalSupply(accounts[1], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(accounts[1], BigInt("200")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessRefreshAlkSpeeds().send({gas: 1000000, from: root});
            let speed = await rewardControl.methods.alkSpeeds(accounts[1]).call();
            assert.equal(speed.toString(), "4161910200000000000");
        });

        it("refresh ALK speeds when there are two markets with the same alloc", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(accounts[1]).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(accounts[2]).send({gas: 1000000, from: root});
            await rewardControl.methods.harnessSetMarketTotalSupply(accounts[1], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(accounts[1], BigInt("200")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalSupply(accounts[2], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(accounts[2], BigInt("200")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessRefreshAlkSpeeds().send({gas: 1000000, from: root});
            let firstMarketSpeed = await rewardControl.methods.alkSpeeds(accounts[1]).call();
            assert.equal(firstMarketSpeed.toString(), "2080955100000000000");
            let secondMarketSpeed = await rewardControl.methods.alkSpeeds(accounts[2]).call();
            assert.equal(secondMarketSpeed.toString(), "2080955100000000000");
        });

        it("refresh ALK speeds when there are two markets with different alloc", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(accounts[1]).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(accounts[2]).send({gas: 1000000, from: root});
            await rewardControl.methods.harnessSetMarketTotalSupply(accounts[1], BigInt("50")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(accounts[1], BigInt("150")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalSupply(accounts[2], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(accounts[2], BigInt("200")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessRefreshAlkSpeeds().send({gas: 1000000, from: root});
            let firstMarketSpeed = await rewardControl.methods.alkSpeeds(accounts[1]).call();
            assert.equal(firstMarketSpeed.toString(), "1664764080000000000");
            let secondMarketSpeed = await rewardControl.methods.alkSpeeds(accounts[2]).call();
            assert.equal(secondMarketSpeed.toString(), "2497146120000000000");
        });
    });

    describe.skip("#updateAlkSupplyIndex", async () => {
        it("update supply state on the first time successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});
            await rewardControl.methods.harnessSetAlkSpeed(accounts[1], BigInt("4161910200000000000")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalSupply(accounts[1], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessUpdateAlkSupplyIndex(accounts[1]).send({gas: 1000000, from: root});
            let response = await rewardControl.methods.alkSupplyState(accounts[1]).call();
            let index = response[0];
            let block = response[1];
            assert.equal(index.toString(), "41619102000000000000000000000000000000000000000000000");
            assert.equal(block.toString(), "1");
        });

        it("update supply state on the second time on the next block successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetBlockNumber(2).send({gas: 1000000, from: root}); // last block is #1, current block is #2
            await rewardControl.methods.harnessSetAlkSpeed(accounts[1], BigInt("4161910200000000000")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetAlkSupplyState(accounts[1], BigInt("41619102000000000000000000000000000000000000000000000"), 1).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalSupply(accounts[1], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessUpdateAlkSupplyIndex(accounts[1]).send({gas: 1000000, from: root});
            let response = await rewardControl.methods.alkSupplyState(accounts[1]).call();
            let index = response[0];
            let block = response[1];
            assert.equal(index.toString(), "83238204000000000000000000000000000000000000000000000");
            assert.equal(block.toString(), "2");
        });

        it("update supply state on the second time with multiple block gap successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetBlockNumber(3).send({gas: 1000000, from: root}); // last block is #1, current block is #3
            await rewardControl.methods.harnessSetAlkSpeed(accounts[1], BigInt("4161910200000000000")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetAlkSupplyState(accounts[1], BigInt("41619102000000000000000000000000000000000000000000000"), 1).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalSupply(accounts[1], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessUpdateAlkSupplyIndex(accounts[1]).send({gas: 1000000, from: root});
            let response = await rewardControl.methods.alkSupplyState(accounts[1]).call();
            let index = response[0];
            let block = response[1];
            assert.equal(index.toString(), "124857306000000000000000000000000000000000000000000000");
            assert.equal(block.toString(), "3");
        });
    });

    describe("#updateAlkBorrowIndex", async () => {
        it("update borrow state on the first time successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});
            await rewardControl.methods.harnessSetAlkSpeed(accounts[1], BigInt("4161910200000000000")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(accounts[1], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessUpdateAlkBorrowIndex(accounts[1]).send({gas: 1000000, from: root});
            let response = await rewardControl.methods.alkBorrowState(accounts[1]).call();
            let index = response[0];
            let block = response[1];
            assert.equal(index.toString(), "41619102000000000000000000000000000000000000000000000");
            assert.equal(block.toString(), "1");
        });

        it("update borrow state on the second time on the next block successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetBlockNumber(2).send({gas: 1000000, from: root}); // last block is #1, current block is #2
            await rewardControl.methods.harnessSetAlkSpeed(accounts[1], BigInt("4161910200000000000")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetAlkBorrowState(accounts[1], BigInt("41619102000000000000000000000000000000000000000000000"), 1).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(accounts[1], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessUpdateAlkBorrowIndex(accounts[1]).send({gas: 1000000, from: root});
            let response = await rewardControl.methods.alkBorrowState(accounts[1]).call();
            let index = response[0];
            let block = response[1];
            assert.equal(index.toString(), "83238204000000000000000000000000000000000000000000000");
            assert.equal(block.toString(), "2");
        });

        it("update borrow state on the second time with multiple block gap successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetBlockNumber(3).send({gas: 1000000, from: root}); // last block is #1, current block is #3
            await rewardControl.methods.harnessSetAlkSpeed(accounts[1], BigInt("4161910200000000000")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetAlkBorrowState(accounts[1], BigInt("41619102000000000000000000000000000000000000000000000"), 1).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(accounts[1], BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessUpdateAlkBorrowIndex(accounts[1]).send({gas: 1000000, from: root});
            let response = await rewardControl.methods.alkBorrowState(accounts[1]).call();
            let index = response[0];
            let block = response[1];
            assert.equal(index.toString(), "124857306000000000000000000000000000000000000000000000");
            assert.equal(block.toString(), "3");
        });
    });

    describe("#distributeSupplierAlk", async () => {
        it("update accrued alk for a supplier on the first time successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetAlkSupplyState(accounts[1], BigInt("41619102000000000000000000000000000000000000000000000"), BigInt("1")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetSupplyBalance(accounts[1], accounts[2], BigInt("25")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessDistributeSupplierAlk(accounts[1], accounts[2]).send({
                gas: 1000000,
                from: root
            });
            let alkAccrued = await rewardControl.methods.alkAccrued(accounts[2]).call();
            assert.equal(alkAccrued.toString(), "0");
            let alkSupplierIndex = await rewardControl.methods.alkSupplierIndex(accounts[1], accounts[2]).call();
            assert.equal(alkSupplierIndex.toString(), "41619102000000000000000000000000000000000000000000000");
        });

        it("update accrued alk for a supplier on the second time successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetAlkSupplyState(accounts[1], BigInt("83238204000000000000000000000000000000000000000000000"), BigInt("1")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetAlkSupplierIndex(accounts[1], accounts[2], BigInt("41619102000000000000000000000000000000000000000000000")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetSupplyBalance(accounts[1], accounts[2], BigInt("25")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessDistributeSupplierAlk(accounts[1], accounts[2]).send({
                gas: 1000000,
                from: root
            });
            let alkAccrued = await rewardControl.methods.alkAccrued(accounts[2]).call();
            assert.equal(alkAccrued.toString(), "1040477550000000000");
            let alkSupplierIndex = await rewardControl.methods.alkSupplierIndex(accounts[1], accounts[2]).call();
            assert.equal(alkSupplierIndex.toString(), "83238204000000000000000000000000000000000000000000000");
        });
    });


});