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
				const result = await AlkemiEarnVerifiedInstance._changeKYCAdmin(
					accounts[1],true,
					{
						from: accounts[0],
					}
				);
				assert.equal(
					result.logs[0].event,
					"KYCAdminChanged",
					"Unable to add KYC Admin from Admin"
				);
			});
			it("Admin can remove KYC Admin", async () => {
				const result = await AlkemiEarnVerifiedInstance._changeKYCAdmin(
					accounts[1],false,
					{
						from: accounts[0],
					}
				);
				assert.equal(
					result.logs[0].event,
					"KYCAdminChanged",
					"Unable to remove KYC Admin from Admin"
				);
			});
		});
	});

	describe("Add and remove KYC Customer", () => {
		beforeEach(async () => {
			await AlkemiEarnVerifiedInstance._changeKYCAdmin(accounts[1],true, {
				from: accounts[0],
			});
		});

		describe("Success", () => {
			it("KYC Admin can add KYC Customer", async () => {
				const result = await AlkemiEarnVerifiedInstance._changeCustomerKYC(
					accounts[2],true,
					{
						from: accounts[1],
					}
				);
				assert.equal(
					result.logs[0].event,
					"KYCCustomerChanged",
					"Unable to add KYC Customer being KYC Admin"
				);
			});
			it("KYC Admin can remove KYC Customer", async () => {
				const result = await AlkemiEarnVerifiedInstance._changeCustomerKYC(
					accounts[2],false,
					{
						from: accounts[1],
					}
				);
				assert.equal(
					result.logs[0].event,
					"KYCCustomerChanged",
					"Unable to remove KYC Customer being KYC Admin"
				);
			});
		});
	});
	describe("Customer KYC Verification", () => {
		beforeEach(async () => {
			await AlkemiEarnVerifiedInstance._changeKYCAdmin(accounts[1],true, {
				from: accounts[0],
			});
			await AlkemiEarnVerifiedInstance._changeCustomerKYC(accounts[2],true, {
				from: accounts[1],
			});
		});
		describe("Success", () => {
			it("KYC Verification status true for verified customers", async () => {
				const result1 = await AlkemiEarnVerifiedInstance.customersWithKYC(accounts[2]);
				assert.equal(result1, true, "Customer KYC status verification failed");
			});
		});
		describe("Failure", () => {
			it("KYC Verification status false for unverified customers", async () => {
				const result1 = await AlkemiEarnVerifiedInstance.customersWithKYC(accounts[1]);
				assert.equal(result1, false, "Customer KYC status verification failed");
			});
		});
	});
	// Liquidator Tests
	describe("Add and remove Liquidator", () => {
		describe("Success", () => {
			it("Admin can add Liquidator", async () => {
				const result = await AlkemiEarnVerifiedInstance._changeLiquidator(
					accounts[2],true,
					{
						from: accounts[0],
					}
				);
				assert.equal(
					result.logs[0].event,
					"LiquidatorChanged",
					"Unable to add Liquidator being Admin"
				);
			});
			it("Admin can remove Liquidator", async () => {
				const result = await AlkemiEarnVerifiedInstance._changeLiquidator(
					accounts[2],false,
					{
						from: accounts[0],
					}
				);
				assert.equal(
					result.logs[0].event,
					"LiquidatorChanged",
					"Unable to remove Liquidator being Admin"
				);
			});
		});
	});
	describe("Liquidator Verification", () => {
		beforeEach(async () => {
			await AlkemiEarnVerifiedInstance._changeLiquidator(accounts[2],true, {
				from: accounts[0],
			});
		});
	});
});
