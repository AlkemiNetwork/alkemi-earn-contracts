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
            await mockMarketLiquidity(rewardControl, marketA, "100", "200");
            await mockSupplyBalance(rewardControl, marketA, supplier, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "25");

            // then
            await assertSupplyResults("1", rewardControl, marketA, supplier,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "50");

            // then
            await assertSupplyResults("2", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when #3 refresh
            await rewardControl.methods.harnessFastForward(3).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});

            // then
            await assertSupplyResults("3", rewardControl, marketA, supplier,
                "4161910200000000000",
                "208095510000000000000000000000000000000000000000000000",
                "7283342850000000000"); // 7.283342850000000000 ALK
        });

        it("refreshAlkSupplyIndex when there are multiple markets and multiple suppliers", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let marketB = accounts[4];
            let marketC = accounts[5];
            let marketD = accounts[6];
            let supplierA = accounts[7];
            let supplierB = accounts[8];
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(marketB).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(marketC).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(marketD).send({gas: 1000000, from: root});
            await mockMarketLiquidity(rewardControl, marketA, 100, 100);
            await mockMarketLiquidity(rewardControl, marketB, 100, 100);
            await mockMarketLiquidity(rewardControl, marketC, 100, 100);
            await mockMarketLiquidity(rewardControl, marketD, 100, 100);
            await mockSupplyBalance(rewardControl, marketA, supplierA, "0");
            await mockSupplyBalance(rewardControl, marketA, supplierB, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh supply index for supplierA
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplierA).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplierA, "50");

            // then
            await assertSupplyResults("1.1", rewardControl, marketA, supplierA,
                "1040477550000000000",
                "10404775500000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh supply index for supplierA and supplierB
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplierA).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplierB).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplierA, "25");
            await mockSupplyBalance(rewardControl, marketA, supplierB, "50");

            // then
            await assertSupplyResults("2.1", rewardControl, marketA, supplierA,
                "1040477550000000000",
                "20809551000000000000000000000000000000000000000000000",
                "520238775000000000"); // 0.520238775000000000 ALK
            await assertSupplyResults("2.2", rewardControl, marketA, supplierB,
                "1040477550000000000",
                "20809551000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #3 refresh supply index for supplierB
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplierB).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplierB, "75");

            // then
            await assertSupplyResults("3.1", rewardControl, marketA, supplierA,
                "1040477550000000000",
                "20809551000000000000000000000000000000000000000000000",
                "520238775000000000"); // 0.520238775000000000 ALK
            await assertSupplyResults("3.2", rewardControl, marketA, supplierB,
                "1040477550000000000",
                "31214326500000000000000000000000000000000000000000000",
                "520238775000000000"); // 0.520238775000000000 ALK

            // when #4 refresh supply index for supplierA
            await mockMarketLiquidity(rewardControl, marketA, 125, 100);
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplierA).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplierA, "50");

            // then
            await assertSupplyResults("4.1", rewardControl, marketA, supplierA,
                "1135066418181818180",
                "40294857845454545440000000000000000000000000000000000",

                "1007371446136363636"); // 1.007371446136363636 ALK
            await assertSupplyResults("4.2", rewardControl, marketA, supplierB,
                "1135066418181818180",
                "31214326500000000000000000000000000000000000000000000",
                "520238775000000000"); // 5.20238775000000000 ALK
        });

    });

    async function mockMarketLiquidity(rewardControl, market, totalSupply, totalBorrows) {
        await rewardControl.methods.harnessSetMarketTotalSupply(market, BigInt(totalSupply)).send({
            gas: 1000000,
            from: root
        });
        await rewardControl.methods.harnessSetMarketTotalBorrows(market, BigInt(totalBorrows)).send({
            gas: 1000000,
            from: root
        });
    }

    async function mockSupplyBalance(rewardControl, market, supplier, supplyBalance) {
        await rewardControl.methods.harnessSetSupplyBalance(market, supplier, BigInt(supplyBalance)).send({
            gas: 1000000,
            from: root
        });
    }

    async function assertSupplyResults(label, rewardControl, market, supplier, expectedAlkSpeed, expectedSupplierIndex, expectedAlkAccrued) {
        let speed = await rewardControl.methods.alkSpeeds(market).call();
        let alkSupplierIndex = await rewardControl.methods.alkSupplierIndex(market, supplier).call();
        let alkAccrued = await rewardControl.methods.alkAccrued(supplier).call();
        console.log(`${label}: actual speed = ${speed}`);
        console.log(`${label}: ALK supplier index = ${alkSupplierIndex}`);
        console.log(`${label}: ALK accrued  = ${alkAccrued}`);
        assert.equal(speed.toString(), expectedAlkSpeed, label);
        assert.equal(alkSupplierIndex.toString(), expectedSupplierIndex, label);
        assert.equal(alkAccrued.toString(), expectedAlkAccrued, label);
    }

});

