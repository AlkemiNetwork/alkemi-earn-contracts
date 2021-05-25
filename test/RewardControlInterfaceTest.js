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

        it("refreshAlkSupplyIndex multiple times should not change anything", async () => {
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
            // then
            await assertSupplyResults("1", rewardControl, marketA, supplier,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #1 refresh more times on the same block
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
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

            // when #2 refresh more times on the same block
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});

            // then everything stays the same
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

    });

    describe("#refreshAlkBorrowIndex", async () => {
        it("refreshAlkBorrowIndex when there is one market and one borrower", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let borrower = accounts[4];
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await mockMarketLiquidity(rewardControl, marketA, "200", "100");
            await mockBorrowBalance(rewardControl, marketA, borrower, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrower, "25");

            // then
            await assertBorrowResults("1", rewardControl, marketA, borrower,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrower, "50");

            // then
            await assertBorrowResults("2", rewardControl, marketA, borrower,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when #3 refresh
            await rewardControl.methods.harnessFastForward(3).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});

            // then
            await assertBorrowResults("3", rewardControl, marketA, borrower,
                "4161910200000000000",
                "208095510000000000000000000000000000000000000000000000",
                "7283342850000000000"); // 7.283342850000000000 ALK
        });

        it("refreshAlkBorrowIndex when there are multiple markets and multiple borrowers", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let marketB = accounts[4];
            let marketC = accounts[5];
            let marketD = accounts[6];
            let borrowerA = accounts[7];
            let borrowerB = accounts[8];
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(marketB).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(marketC).send({gas: 1000000, from: root});
            await rewardControl.methods.addMarket(marketD).send({gas: 1000000, from: root});
            await mockMarketLiquidity(rewardControl, marketA, 100, 100);
            await mockMarketLiquidity(rewardControl, marketB, 100, 100);
            await mockMarketLiquidity(rewardControl, marketC, 100, 100);
            await mockMarketLiquidity(rewardControl, marketD, 100, 100);
            await mockBorrowBalance(rewardControl, marketA, borrowerA, "0");
            await mockBorrowBalance(rewardControl, marketA, borrowerB, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh borrow index for borrowerA
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrowerA).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrowerA, "50");

            // then
            await assertBorrowResults("1.1", rewardControl, marketA, borrowerA,
                "1040477550000000000",
                "10404775500000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh borrow index for borrowerA and borrowerB
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrowerA).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrowerB).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrowerA, "25");
            await mockBorrowBalance(rewardControl, marketA, borrowerB, "50");

            // then
            await assertBorrowResults("2.1", rewardControl, marketA, borrowerA,
                "1040477550000000000",
                "20809551000000000000000000000000000000000000000000000",
                "520238775000000000"); // 0.520238775000000000 ALK
            await assertBorrowResults("2.2", rewardControl, marketA, borrowerB,
                "1040477550000000000",
                "20809551000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #3 refresh borrow index for borrowerB
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrowerB).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrowerB, "75");

            // then
            await assertBorrowResults("3.1", rewardControl, marketA, borrowerA,
                "1040477550000000000",
                "20809551000000000000000000000000000000000000000000000",
                "520238775000000000"); // 0.520238775000000000 ALK
            await assertBorrowResults("3.2", rewardControl, marketA, borrowerB,
                "1040477550000000000",
                "31214326500000000000000000000000000000000000000000000",
                "520238775000000000"); // 0.520238775000000000 ALK

            // when #4 refresh borrow index for borrowerA
            await mockMarketLiquidity(rewardControl, marketA, 100, 125);
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrowerA).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrowerA, "50");

            // then
            await assertBorrowResults("4.1", rewardControl, marketA, borrowerA,
                "1135066418181818180",
                "40294857845454545440000000000000000000000000000000000",

                "1007371446136363636"); // 1.007371446136363636 ALK
            await assertBorrowResults("4.2", rewardControl, marketA, borrowerB,
                "1135066418181818180",
                "31214326500000000000000000000000000000000000000000000",
                "520238775000000000"); // 5.20238775000000000 ALK
        });

        it("refreshAlkBorrowIndex multiple times should not change anything", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], accounts[3]).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let borrower = accounts[4];
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await mockMarketLiquidity(rewardControl, marketA, "200", "100");
            await mockBorrowBalance(rewardControl, marketA, borrower, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            // then
            await assertBorrowResults("1", rewardControl, marketA, borrower,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #1 refresh more times on the same block
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrower, "25");

            // then
            await assertBorrowResults("1", rewardControl, marketA, borrower,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrower, "50");

            // then
            await assertBorrowResults("2", rewardControl, marketA, borrower,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when #2 refresh more times on the same block
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});

            // then everything stays the same
            await assertBorrowResults("2", rewardControl, marketA, borrower,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when #3 refresh
            await rewardControl.methods.harnessFastForward(3).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});

            // then
            await assertBorrowResults("3", rewardControl, marketA, borrower,
                "4161910200000000000",
                "208095510000000000000000000000000000000000000000000000",
                "7283342850000000000"); // 7.283342850000000000 ALK
        })

    });

    describe("#claimAlk", async () => {
        it("claimAlk when there is one market and one user borrowing and lending assets in the market", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await ALK.methods.transfer(rewardControl._address, BigInt("70000000000000000000000000")).send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let supplier = accounts[4];
            let borrower = supplier;
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await mockMarketLiquidity(rewardControl, marketA, "100", "100");
            await mockSupplyBalance(rewardControl, marketA, supplier, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh supply index
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "25");

            // then
            await assertSupplyResults("1", rewardControl, marketA, supplier,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh supply index
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "50");

            // then
            await assertSupplyResults("2", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when #3 refresh supply index
            await rewardControl.methods.harnessFastForward(3).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});

            // then
            await assertSupplyResults("3", rewardControl, marketA, supplier,
                "4161910200000000000",
                "208095510000000000000000000000000000000000000000000000",
                "7283342850000000000"); // 7.283342850000000000 ALK

            // when #1 refresh borrow index
            await rewardControl.methods.harnessFastForward(3).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrower, "25");

            // then
            await assertBorrowResults("4", rewardControl, marketA, borrower,
                "4161910200000000000",
                "332952816000000000000000000000000000000000000000000000",
                "7283342850000000000"); // 7.283342850000000000 ALK

            // when #2 refresh borrow index
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkBorrowIndex(marketA, borrower).send({gas: 1000000, from: root});
            await mockBorrowBalance(rewardControl, marketA, borrower, "50");

            // then
            await assertBorrowResults("5", rewardControl, marketA, borrower,
                "4161910200000000000",
                "374571918000000000000000000000000000000000000000000000",
                "8323820400000000000"); // 8.323820400000000000 ALK (+ 1.040477550000000000 ALK)

            // when claim on the same block
            await rewardControl.methods.claimAlk(supplier).send({gas: 1000000, from: root});

            // then
            let participantAlkBalance = await ALK.methods.balanceOf(supplier).call();
            assert.equal(participantAlkBalance.toString(), "16647640800000000000"); // 16,647640800000000000 ALK = 8.323820400000000000 ALK (from last ALK accrued) + 8.323820400000000000 ALK (claimAlk will also refresh supplier index: 4161910200000000000 * 50% * 4 blocks)
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "69999983352359200000000000"); // 69999983.352359200000000000 ALK
            await assertSupplyResults("6", rewardControl, marketA, supplier,
                "4161910200000000000",
                "374571918000000000000000000000000000000000000000000000",
                "0"); // 0 ALK
            await assertBorrowResults("7", rewardControl, marketA, borrower,
                "4161910200000000000",
                "374571918000000000000000000000000000000000000000000000",
                "0"); // 0 (+ 1.040477550000000000 ALK)
        });

        it("claimAlk when there are multiple markets and multiple users (ALK accrued from one market)", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await ALK.methods.transfer(rewardControl._address, BigInt("70000000000000000000000000")).send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});
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

            // when #5 claim ALK for supplierA on 1 block away
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.claimAlk(supplierA).send({gas: 1000000, from: root});

            // then (supplierA)
            let supplierAAlkBalance = await ALK.methods.balanceOf(supplierA).call();
            assert.equal(supplierAAlkBalance.toString(), "1461398013409090908"); // 1.461398013409090908 ALK = 1.007371446136363636 ALK (from last ALK accrued) + 0.454026567272727272 ALK (1135066418181818180 * 40% * 1 block)
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "69999998538601986590909092");
            await assertSupplyResults("5.1", rewardControl, marketA, supplierA,
                "1135066418181818180",
                "49375389190909090880000000000000000000000000000000000",
                "0"); // 0 ALK

            // then (supplierB): there is no impact on supplierB
            let supplierBAlkBalance = await ALK.methods.balanceOf(supplierB).call();
            assert.equal(supplierBAlkBalance.toString(), "0"); // 1.461398013409090908 ALK
            await assertSupplyResults("5.2", rewardControl, marketA, supplierB,
                "1135066418181818180",
                "31214326500000000000000000000000000000000000000000000",
                "520238775000000000"); //
        });

        it("claimAlk when there are multiple markets and multiple users (ALK accrued from multiple markets)", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await ALK.methods.transfer(rewardControl._address, BigInt("70000000000000000000000000")).send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});
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

            // when #4 refresh supply index for supplierA (marketA)
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

            // when #4 refresh supply index for supplierA (marketB)
            await rewardControl.methods.refreshAlkSupplyIndex(marketB, supplierA).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketB, supplierA, "25");

            // then
            await assertSupplyResults("4.3", rewardControl, marketB, supplierA,
                "1008947927272727271",
                "40357917090909090840000000000000000000000000000000000",
                "1007371446136363636"); // 1.007371446136363636 ALK (it stays the same due to the first time supplierA use marketB)

            // when #5 claim ALK for supplierA on 1 block away
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.claimAlk(supplierA).send({gas: 1000000, from: root});

            // then (supplierA)
            let supplierAAlkBalance = await ALK.methods.balanceOf(supplierA).call();
            // (marketA) 1.461398013409090908 ALK = 1.007371446136363636 ALK (from last ALK accrued) + 0.454026567272727272 ALK (1135066418181818180 * 40% * 1 block)
            // (marketA + marketB) 1.713634995227272725 ALK = 1.461398013409090908 ALK + 0.252236981818181817 ALK (1008947927272727271 * 25% * 1 block)
            assert.equal(supplierAAlkBalance.toString(), "1713634995227272725");
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "69999998286365004772727275");
            await assertSupplyResults("5.1", rewardControl, marketA, supplierA,
                "1135066418181818180",
                "49375389190909090880000000000000000000000000000000000",
                "0"); // 0 ALK

            // then (supplierB): there is no impact on supplierB
            let supplierBAlkBalance = await ALK.methods.balanceOf(supplierB).call();
            assert.equal(supplierBAlkBalance.toString(), "0"); // 1.461398013409090908 ALK
            await assertSupplyResults("5.2", rewardControl, marketA, supplierB,
                "1135066418181818180",
                "31214326500000000000000000000000000000000000000000000",
                "520238775000000000"); //
        })

        it("claimAlk multiple times should not change anything", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await ALK.methods.transfer(rewardControl._address, BigInt("70000000000000000000000000")).send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let supplier = accounts[4];
            let borrower = supplier;
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await mockMarketLiquidity(rewardControl, marketA, "100", "100");
            await mockSupplyBalance(rewardControl, marketA, supplier, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh supply index
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "25");

            // then
            await assertSupplyResults("1", rewardControl, marketA, supplier,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh supply index
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "50");

            // then
            await assertSupplyResults("2", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when claim on the same block
            await rewardControl.methods.claimAlk(supplier).send({gas: 1000000, from: root});

            // then
            let participantAlkBalance = await ALK.methods.balanceOf(supplier).call();
            assert.equal(participantAlkBalance.toString(), "1040477550000000000");
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "69999998959522450000000000");
            await assertSupplyResults("3", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "0"); // 0 ALK
            await assertBorrowResults("4", rewardControl, marketA, borrower,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when claim again and again
            await rewardControl.methods.claimAlk(supplier).send({gas: 1000000, from: root});
            await rewardControl.methods.claimAlk(supplier).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "0");

            // then ALK accrued is not changed
            let participantAlkBalance_2 = await ALK.methods.balanceOf(supplier).call();
            assert.equal(participantAlkBalance_2.toString(), "1040477550000000000");
            let rewardControlAlkBalance_2 = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance_2.toString(), "69999998959522450000000000");
            await assertSupplyResults("5", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when there is no balance left, no ALK for you if you wait for more blocks passes
            await rewardControl.methods.harnessFastForward(10).send({gas: 1000000, from: root});
            await rewardControl.methods.claimAlk(supplier).send({gas: 1000000, from: root});

            // then ALK accrued is still not changed
            let participantAlkBalance_3 = await ALK.methods.balanceOf(supplier).call();
            assert.equal(participantAlkBalance_3.toString(), "1040477550000000000");
            let rewardControlAlkBalance_3 = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance_3.toString(), "69999998959522450000000000");
            await assertSupplyResults("6", rewardControl, marketA, supplier,
                "4161910200000000000",
                "499429224000000000000000000000000000000000000000000000",
                "0"); // 0 ALK
        });

        it("claimAlk when RewardControl has not enough balance", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let supplier = accounts[4];
            let borrower = supplier;
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await mockMarketLiquidity(rewardControl, marketA, "100", "100");
            await mockSupplyBalance(rewardControl, marketA, supplier, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh supply index
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "25");

            // then
            await assertSupplyResults("1", rewardControl, marketA, supplier,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh supply index
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "50");

            // then
            await assertSupplyResults("2", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when claim with not enough balance
            await rewardControl.methods.claimAlk(supplier).send({gas: 1000000, from: root});

            // then
            let participantAlkBalance = await ALK.methods.balanceOf(supplier).call();
            assert.equal(participantAlkBalance.toString(), "0");
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "0");
            await assertSupplyResults("3", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when claim again with enough balance
            await ALK.methods.transfer(rewardControl._address, BigInt("70000000000000000000000000")).send({from: root});
            await rewardControl.methods.claimAlk(supplier).send({gas: 1000000, from: root});

            // then ALK accrued is not changed
            let participantAlkBalance_2 = await ALK.methods.balanceOf(supplier).call();
            assert.equal(participantAlkBalance_2.toString(), "1040477550000000000");
            let rewardControlAlkBalance_2 = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance_2.toString(), "69999998959522450000000000");
            await assertSupplyResults("5", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "0"); // 0 ALK
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

    async function mockBorrowBalance(rewardControl, market, borrower, borrowBalance) {
        await rewardControl.methods.harnessSetBorrowBalance(market, borrower, BigInt(borrowBalance)).send({
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

    async function assertBorrowResults(label, rewardControl, market, borrower, expectedAlkSpeed, expectedBorrowerIndex, expectedAlkAccrued) {
        let speed = await rewardControl.methods.alkSpeeds(market).call();
        let alkBorrowerIndex = await rewardControl.methods.alkBorrowerIndex(market, borrower).call();
        let alkAccrued = await rewardControl.methods.alkAccrued(borrower).call();
        console.log(`${label}: actual speed = ${speed}`);
        console.log(`${label}: ALK borrower index = ${alkBorrowerIndex}`);
        console.log(`${label}: ALK accrued  = ${alkAccrued}`);
        assert.equal(speed.toString(), expectedAlkSpeed, label);
        assert.equal(alkBorrowerIndex.toString(), expectedBorrowerIndex, label);
        assert.equal(alkAccrued.toString(), expectedAlkAccrued, label);
    }

});

