"use strict";

const {gas} = require('./Utils');
const {getContract} = require('./Contract');
const RewardControl = getContract("./RewardControlHarness.sol");
const EIP20 = getContract("./test/EIP20Harness.sol");

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

    describe.skip("#updateAlkBorrowIndex", async () => {
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

    describe.skip("#distributeSupplierAlk", async () => {
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
            assert.equal(alkAccrued.toString(), "1040477550000000000"); // 1/4 of 4161910200000000000
            let alkSupplierIndex = await rewardControl.methods.alkSupplierIndex(accounts[1], accounts[2]).call();
            assert.equal(alkSupplierIndex.toString(), "83238204000000000000000000000000000000000000000000000");
        });
    });

    describe.skip("#distributeBorrowerAlk", async () => {
        it("update accrued alk for a borrower on the first time successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetAlkBorrowState(accounts[1], BigInt("41619102000000000000000000000000000000000000000000000"), BigInt("1")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetBorrowBalance(accounts[1], accounts[2], BigInt("25")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessDistributeBorrowerAlk(accounts[1], accounts[2]).send({
                gas: 1000000,
                from: root
            });
            let alkAccrued = await rewardControl.methods.alkAccrued(accounts[2]).call();
            assert.equal(alkAccrued.toString(), "0");
            let alkBorrowerIndex = await rewardControl.methods.alkBorrowerIndex(accounts[1], accounts[2]).call();
            assert.equal(alkBorrowerIndex.toString(), "41619102000000000000000000000000000000000000000000000");
        });

        it("update accrued alk for a borrower on the second time successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.harnessSetAlkBorrowState(accounts[1], BigInt("83238204000000000000000000000000000000000000000000000"), BigInt("1")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetAlkBorrowerIndex(accounts[1], accounts[2], BigInt("41619102000000000000000000000000000000000000000000000")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetBorrowBalance(accounts[1], accounts[2], BigInt("25")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessDistributeBorrowerAlk(accounts[1], accounts[2]).send({
                gas: 1000000,
                from: root
            });
            let alkAccrued = await rewardControl.methods.alkAccrued(accounts[2]).call();
            assert.equal(alkAccrued.toString(), "1040477550000000000"); // 1/4 of 4161910200000000000
            let alkBorrowerIndex = await rewardControl.methods.alkBorrowerIndex(accounts[1], accounts[2]).call();
            assert.equal(alkBorrowerIndex.toString(), "83238204000000000000000000000000000000000000000000000");
        });
    });

    describe.skip("#transferAlk", async () => {
        it("transfer ALK when RewardControl has no balance", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});

            await rewardControl.methods.harnessTransferAlk(accounts[1], BigInt("1040477550000000000")).send({
                gas: 1000000,
                from: root
            });
            let participantAlkBalance = await ALK.methods.balanceOf(accounts[1]).call();
            assert.equal(participantAlkBalance.toString(), "0");
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "0");
        });

        it("transfer ALK when RewardControl has enough balance", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});
            await ALK.methods.transfer(rewardControl._address, BigInt("1040477550000000000")).send({from: root});

            await rewardControl.methods.harnessTransferAlk(accounts[1], BigInt("1040477550000000000")).send({
                gas: 1000000,
                from: root
            });
            let participantAlkBalance = await ALK.methods.balanceOf(accounts[1]).call();
            assert.equal(participantAlkBalance.toString(), "1040477550000000000");
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "0");
        });

        it("transfer ALK when RewardControl has not enough balance", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});
            await ALK.methods.transfer(rewardControl._address, BigInt("940477550000000000")).send({from: root});

            await rewardControl.methods.harnessTransferAlk(accounts[1], BigInt("1040477550000000000")).send({
                gas: 1000000,
                from: root
            });
            let participantAlkBalance = await ALK.methods.balanceOf(accounts[1]).call();
            assert.equal(participantAlkBalance.toString(), "0");
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "940477550000000000");
        });
    });

    describe.skip("#transferOwnership", async () => {
        it("transfer OwnerShip successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            let owner_1 = await rewardControl.methods.owner().call();
            assert.equal(owner_1.toString(), root.toString());
            await rewardControl.methods.transferOwnership(accounts[1]).send({from: root});
            let owner_2 = await rewardControl.methods.owner().call();
            assert.equal(owner_2.toString(), root.toString());
            await rewardControl.methods.acceptOwnership().send({from: accounts[1]});
            let owner_3 = await rewardControl.methods.owner().call();
            assert.equal(owner_3.toString(), accounts[1].toString());
        });

        it("transfer OwnerShip failed without permission", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            let owner_1 = await rewardControl.methods.owner().call();
            assert.equal(owner_1.toString(), root.toString());
            await assert.revert(rewardControl.methods.transferOwnership(accounts[1]).send({from: accounts[1]}), "revert non-owner"); // accounts[1] is not the owner at this moment
            let owner_2 = await rewardControl.methods.owner().call();
            assert.equal(owner_2.toString(), root.toString());
            await assert.revert(rewardControl.methods.acceptOwnership().send({from: accounts[1]}), "revert AcceptOwnership: only new owner do this.");
            let owner_3 = await rewardControl.methods.owner().call();
            assert.equal(owner_3.toString(), root.toString());
        });
    });

    describe.skip("#{add|remove}Market", async () => {
        it("add/remove market successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 0);

            await rewardControl.methods.addMarket(accounts[4]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 1);

            await rewardControl.methods.addMarket(accounts[5]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);

            await rewardControl.methods.addMarket(accounts[6]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal((await rewardControl.methods.allMarkets(2).call()).toString(), accounts[6].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 3);

            await rewardControl.methods.addMarket(accounts[7]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal((await rewardControl.methods.allMarkets(2).call()).toString(), accounts[6].toString());
            assert.equal((await rewardControl.methods.allMarkets(3).call()).toString(), accounts[7].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 4);

            await rewardControl.methods.removeMarket(1).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[6].toString());
            assert.equal((await rewardControl.methods.allMarkets(2).call()).toString(), accounts[7].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 3);

            await rewardControl.methods.removeMarket(10).send({from: root}); // the index doesn't exist, nothing happens.
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[6].toString());
            assert.equal((await rewardControl.methods.allMarkets(2).call()).toString(), accounts[7].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 3);

            await rewardControl.methods.removeMarket(0).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[6].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[7].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);

            await rewardControl.methods.removeMarket(1).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[6].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 1);

            await rewardControl.methods.removeMarket(0).send({from: root});
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 0);

            await rewardControl.methods.addMarket(accounts[1]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[1].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 1);

            await rewardControl.methods.addMarket(accounts[2]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[1].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[2].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);

            await rewardControl.methods.addMarket(accounts[3]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[1].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[2].toString());
            assert.equal((await rewardControl.methods.allMarkets(2).call()).toString(), accounts[3].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 3);
        });

        it("add/remove market failed without permission", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 0);

            await rewardControl.methods.addMarket(accounts[4]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 1);

            await rewardControl.methods.addMarket(accounts[5]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);

            await assert.revert(rewardControl.methods.addMarket(accounts[6]).send({from: accounts[1]}), "revert non-owner");
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);

            await assert.revert(rewardControl.methods.removeMarket(0).send({from: accounts[1]}), "revert non-owner");
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);
        });

        it("add existing market failed", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 0);

            await rewardControl.methods.addMarket(accounts[4]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 1);

            await rewardControl.methods.addMarket(accounts[5]).send({from: root});
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);

            await assert.revert(rewardControl.methods.addMarket(accounts[4]).send({from: root}), "revert Market already exists");
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);

            await assert.revert(rewardControl.methods.addMarket(accounts[5]).send({from: root}), "revert Market already exists");
            assert.equal((await rewardControl.methods.allMarkets(0).call()).toString(), accounts[4].toString());
            assert.equal((await rewardControl.methods.allMarkets(1).call()).toString(), accounts[5].toString());
            assert.equal(await rewardControl.methods.harnessGetNumberOfMarkets().call(), 2);
        });
    });

    describe.skip("#{set|get}AlkAddress", async () => {
        it("set/get alk address successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.getAlkAddress().call(), accounts[3]);

            await rewardControl.methods.setAlkAddress(accounts[4]).send({from: root});
            assert.equal(await rewardControl.methods.getAlkAddress().call(), accounts[4]);
        });

        it("set alk address failed with permission", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.getAlkAddress().call(), accounts[3]);

            await assert.revert(rewardControl.methods.setAlkAddress(accounts[4]).send({from: accounts[5]}), "revert non-owner");
            assert.equal(await rewardControl.methods.getAlkAddress().call(), accounts[3]); // alk address stays the same.
        });

        it("set the same alk address failed ", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.getAlkAddress().call(), accounts[3]);

            await assert.revert(rewardControl.methods.setAlkAddress(accounts[3]).send({from: root}), "revert The same ALK address");
            assert.equal(await rewardControl.methods.getAlkAddress().call(), accounts[3]); // alk address stays the same.
        });

        it("set empty alk address failed ", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.getAlkAddress().call(), accounts[3]);

            await assert.revert(rewardControl.methods.setAlkAddress("0x0000000000000000000000000000000000000000").send({from: root}), "revert ALK address cannot be empty");
            assert.equal(await rewardControl.methods.getAlkAddress().call(), accounts[3]); // alk address stays the same.
        });
    });

    describe.skip("#setAlkRate", async () => {
        it("set alk rate successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.alkRate().call(), 4161910200000000000);

            await rewardControl.methods.setAlkRate(100).send({from: root});
            assert.equal(await rewardControl.methods.alkRate().call(), 100);

            await rewardControl.methods.setAlkRate(100).send({from: root});
            assert.equal(await rewardControl.methods.alkRate().call(), 100);

            await assert.revert(rewardControl.methods.setAlkRate(200).send({from: accounts[4]}), "revert non-owner");
            assert.equal(await rewardControl.methods.alkRate().call(), 100);

            await rewardControl.methods.setAlkRate(0).send({from: root});
            assert.equal(await rewardControl.methods.alkRate().call(), 0);
        });
    });

    describe("#{set|get}MoneyMarketAddress", async () => {
        it("set/get MoneyMarket address successfully", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.getMoneyMarketAddress().call(), accounts[2]);

            await rewardControl.methods.setMoneyMarketAddress(accounts[4]).send({from: root});
            assert.equal(await rewardControl.methods.getMoneyMarketAddress().call(), accounts[4]);
        });

        it("set the same MoneyMarket address failed", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.getMoneyMarketAddress().call(), accounts[2]);

            await assert.revert(rewardControl.methods.setMoneyMarketAddress(accounts[2]).send({from: root}), "revert The same Money Market address");
            assert.equal(await rewardControl.methods.getMoneyMarketAddress().call(), accounts[2]);
        });

        it("set empty MoneyMarket address failed", async () => {
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            assert.equal(await rewardControl.methods.getMoneyMarketAddress().call(), accounts[2]);

            await assert.revert(rewardControl.methods.setMoneyMarketAddress("0x0000000000000000000000000000000000000000").send({from: root}), "revert MoneyMarket address cannot be empty");
            assert.equal(await rewardControl.methods.getMoneyMarketAddress().call(), accounts[2]);
        });
    });
});