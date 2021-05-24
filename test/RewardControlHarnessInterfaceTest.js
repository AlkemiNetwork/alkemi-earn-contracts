"use strict";

const {gas} = require('./Utils');
const {getContract} = require('./Contract');
const RewardControl = getContract("./test/RewardControlHarness.sol");
const EIP20 = getContract("./test/EIP20Harness.sol");

contract('RewardControl interface test', function ([root, ...accounts]) {

    describe("#refreshAlkSupplyIndex", async () => {
        it("refreshAlkSupplyIndex when there is one market and one supplier", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let supplier = accounts[4];
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await rewardControl.methods.harnessSetMarketTotalSupply(marketA, BigInt("100")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetMarketTotalBorrows(marketA, BigInt("200")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetSupplyBalance(marketA, supplier, BigInt("25")).send({
                gas: 1000000,
                from: root
            });
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});

            // then
            let speed_1 = await rewardControl.methods.alkSpeeds(marketA).call();
            assert.equal(speed_1.toString(), "4161910200000000000");
            let alkSupplierIndex_1 = await rewardControl.methods.alkSupplierIndex(marketA, supplier).call();
            assert.equal(alkSupplierIndex_1.toString(), "41619102000000000000000000000000000000000000000000000");
            let alkAccrued_1 = await rewardControl.methods.alkAccrued(supplier).call();
            assert.equal(alkAccrued_1.toString(), "0");

            // when #2 refresh
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});

            // then
            let speed_2 = await rewardControl.methods.alkSpeeds(marketA).call();
            assert.equal(speed_2.toString(), "4161910200000000000");
            let alkSupplierIndex_2 = await rewardControl.methods.alkSupplierIndex(marketA, supplier).call();
            assert.equal(alkSupplierIndex_2.toString(), "83238204000000000000000000000000000000000000000000000");
            let alkAccrued_2 = await rewardControl.methods.alkAccrued(supplier).call();
            assert.equal(alkAccrued_2.toString(), "1040477550000000000"); // 1.040477550000000000 ALK

            // when #3 refresh
            await rewardControl.methods.harnessFastForward(3).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});

            // then
            let speed_3 = await rewardControl.methods.alkSpeeds(marketA).call();
            assert.equal(speed_3.toString(), "4161910200000000000");
            let alkSupplierIndex_3 = await rewardControl.methods.alkSupplierIndex(marketA, supplier).call();
            assert.equal(alkSupplierIndex_3.toString(), "208095510000000000000000000000000000000000000000000000");
            let alkAccrued_3 = await rewardControl.methods.alkAccrued(supplier).call();
            assert.equal(alkAccrued_3.toString(), "4161910200000000000"); // 4.161910200000000000 ALK
        });


    });

});