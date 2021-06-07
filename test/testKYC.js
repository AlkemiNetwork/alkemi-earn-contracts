const AlkemiEarnVerified = artifacts.require("AlkemiEarnVerified");

contract("AlkemiEarnVerified", (accounts) => {
	// First test case
	var AlkemiEarnVerifiedInstance;
	beforeEach(async () => {
		AlkemiEarnVerifiedInstance = await AlkemiEarnVerified.deployed();
		await AlkemiEarnVerifiedInstance.initializer({
			from: accounts[0],
		});
	});
	describe("Add and remove KYC Admin", () => {
		describe("Success", () => {
			it("Admin can add KYC Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance.addKYCAdmin(
					accounts[1],
					{
						from: accounts[0],
					}
				);
				assert.equal(
					result.logs[0].event,
					"KYCAdminAdded",
					"Unable to add KYC Admin from Admin"
				);
			});
			it("Admin can remove KYC Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance.removeKYCAdmin(
					accounts[1],
					{
						from: accounts[0],
					}
				);
				assert.equal(
					result.logs[0].event,
					"KYCAdminRemoved",
					"Unable to remove KYC Admin from Admin"
				);
			});
		});
		describe("Failure", () => {
			it("Cannot add KYC Admin if not Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance.addKYCAdmin(
					accounts[1],
					{
						from: accounts[1],
					}
				);
				assert.equal(
					result.logs[0].event,
					"Failure",
					"Able to add KYC Admin even if not Admin"
				);
			});
			it("Cannot remove KYC Admin if not Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance.removeKYCAdmin(
					accounts[1],
					{
						from: accounts[1],
					}
				);
				assert.equal(
					result.logs[0].event,
					"Failure",
					"Able to remove KYC Admin even if not Admin"
				);
			});
		});
	});

	describe("Add and remove KYC Customer", () => {
		beforeEach(async () => {
			await AlkemiEarnVerifiedInstance.addKYCAdmin(accounts[1], {
				from: accounts[0],
			});
		});

		describe("Success", () => {
			it("KYC Admin can add KYC Customer", async () => {
				const result = await AlkemiEarnVerifiedInstance.addCustomerKYC(
					accounts[2],
					{
						from: accounts[1],
					}
				);
				assert.equal(
					result.logs[0].event,
					"KYCCustomerAdded",
					"Unable to add KYC Customer being KYC Admin"
				);
			});
			it("KYC Admin can remove KYC Customer", async () => {
				const result = await AlkemiEarnVerifiedInstance.removeCustomerKYC(
					accounts[2],
					{
						from: accounts[1],
					}
				);
				assert.equal(
					result.logs[0].event,
					"KYCCustomerRemoved",
					"Unable to remove KYC Customer being KYC Admin"
				);
			});
		});
		describe("Failure", () => {
			it("Cannot add KYC Customer if not KYC Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance.addCustomerKYC(
					accounts[2],
					{
						from: accounts[2],
					}
				);
				assert.equal(
					result.logs[0].event,
					"Failure",
					"Able to add KYC Customer even if not KYC Admin"
				);
			});
			it("Cannot remove KYC Customer if not KYC Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance.removeCustomerKYC(
					accounts[2],
					{
						from: accounts[2],
					}
				);
				assert.equal(
					result.logs[0].event,
					"Failure",
					"Able to remove KYC Customer even if not KYC Admin"
				);
			});
		});
	});
	describe("Customer KYC Verification", () => {
		beforeEach(async () => {
			await AlkemiEarnVerifiedInstance.addKYCAdmin(accounts[1], {
				from: accounts[0],
			});
			await AlkemiEarnVerifiedInstance.addCustomerKYC(accounts[2], {
				from: accounts[1],
			});
		});
		describe("Success", () => {
			it("KYC verified customer can access functions", async () => {
				const result1 = await AlkemiEarnVerifiedInstance.supply(
					accounts[3],
					100,
					{
						from: accounts[2],
					}
				);
				const result2 = await AlkemiEarnVerifiedInstance.repayBorrow(
					accounts[3],
					100,
					{
						from: accounts[2],
					}
				);
				const result3 = await AlkemiEarnVerifiedInstance.liquidateBorrow(
					accounts[3],
					accounts[3],
					accounts[3],
					100,
					{
						from: accounts[2],
					}
				);
				const result4 = await AlkemiEarnVerifiedInstance.borrow(
					accounts[3],
					100,
					{
						from: accounts[2],
					}
				);
				assert.notEqual(
					result1.logs[0].args.error,
					28,
					"Unverified customer is able to access supply"
				);
				assert.notEqual(
					result2.logs[0].args.error,
					28,
					"Unverified customer is able to access repayBorrow"
				);
				assert.notEqual(
					result3.logs[0].args.error,
					28,
					"Unverified customer is able to access liquidateBorrow"
				);
				assert.notEqual(
					result4.logs[0].args.error,
					28,
					"Unverified customer is able to access borrow"
				);
			});
			it("KYC Verification status true for verified customers", async () => {
				const result1 = await AlkemiEarnVerifiedInstance.verifyKYC(accounts[2]);
				assert.equal(result1, true, "Customer KYC status verification failed");
			});
		});
		describe("Failure", () => {
			it("KYC Verification status false for unverified customers", async () => {
				const result1 = await AlkemiEarnVerifiedInstance.verifyKYC(accounts[1]);
				assert.equal(result1, false, "Customer KYC status verification failed");
			});
		});
	});
	// Liquidator Tests
	describe("Add and remove Liquidator", () => {
		describe("Success", () => {
			it("Admin can add Liquidator", async () => {
				const result = await AlkemiEarnVerifiedInstance.addLiquidator(
					accounts[2],
					{
						from: accounts[0],
					}
				);
				assert.equal(
					result.logs[0].event,
					"LiquidatorAdded",
					"Unable to add Liquidator being Admin"
				);
			});
			it("Admin can remove Liquidator", async () => {
				const result = await AlkemiEarnVerifiedInstance.removeLiquidator(
					accounts[2],
					{
						from: accounts[0],
					}
				);
				assert.equal(
					result.logs[0].event,
					"LiquidatorRemoved",
					"Unable to remove Liquidator being Admin"
				);
			});
		});
		describe("Failure", () => {
			it("Cannot add Liquidator if not Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance.addLiquidator(
					accounts[2],
					{
						from: accounts[2],
					}
				);
				assert.equal(
					result.logs[0].event,
					"Failure",
					"Able to add Liquidator even if not Admin"
				);
			});
			it("Cannot remove Liquidator if not Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance.removeLiquidator(
					accounts[2],
					{
						from: accounts[2],
					}
				);
				assert.equal(
					result.logs[0].event,
					"Failure",
					"Able to remove Liquidator even if not Admin"
				);
			});
		});
	});
	describe("Liquidator Verification", () => {
		beforeEach(async () => {
			await AlkemiEarnVerifiedInstance.addLiquidator(accounts[2], {
				from: accounts[0],
			});
		});
		describe("Success", () => {
			it("Liquidator can access liquidateBorrow Function", async () => {
				const result1 = await AlkemiEarnVerifiedInstance.liquidateBorrow(
					accounts[3],
					accounts[3],
					accounts[3],
					100,
					{
						from: accounts[2],
					}
				);
				assert.notEqual(
					result1.logs[0].args.error,
					29,
					"Unverified customer is able to access liquidateBorrow"
				);
			});
			it("Liquidator status true for Liquidators", async () => {
				const result1 = await AlkemiEarnVerifiedInstance.verifyLiquidator(
					accounts[2]
				);
				assert.equal(result1, true, "Liquidator status verification failed");
			});
		});
	});
});
