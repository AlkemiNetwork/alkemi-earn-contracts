pragma solidity ^0.4.24;

import "../../contracts/AlkemiRateModel.sol";

/**
 * @title A Fixed Interest Rate Model for tests
 * @author Compound
 * @notice Interest rates should be scaled by 10e18
 */
contract FixedInterestRateModel is AlkemiRateModel {
    uint256 supplyRate;
    uint256 borrowRate;

    constructor(uint256 supplyRate_, uint256 borrowRate_) public {
        supplyRate = supplyRate_;
        borrowRate = borrowRate_;
    }

    /**
     * @notice Gets the current supply interest rate based on the given asset, total cash and total borrows
     * @dev The return value should be scaled by 1e18, thus a return value of
     *      `(true, 1000000000000)` implies an interest rate of 0.000001 or 0.0001% *per block*.
     * @param _asset The asset to get the interest rate of
     * @param _cash The total cash of the asset in the market
     * @param _borrows The total borrows of the asset in the market
     * @return Success or failure and the supply interest rate per block scaled by 10e18
     */
    function getSupplyRate(
        address _asset,
        uint256 _cash,
        uint256 _borrows
    ) public view returns (uint256, uint256) {
        uint256(_asset) + _cash + _borrows; // pragma ignore unused variables?

        return (0, supplyRate);
    }

    /**
     * @notice Gets the current borrow interest rate based on the given asset, total cash and total borrows
     * @dev The return value should be scaled by 1e18, thus a return value of
     *      `(true, 1000000000000)` implies an interest rate of 0.000001 or 0.0001% *per block*.
     * @param _asset The asset to get the interest rate of
     * @param _cash The total cash of the asset in the market
     * @param _borrows The total borrows of the asset in the market
     * @return Success or failure and the borrow interest rate per block scaled by 10e18
     */
    function getBorrowRate(
        address _asset,
        uint256 _cash,
        uint256 _borrows
    ) public view returns (uint256, uint256) {
        uint256(_asset) + _cash + _borrows; // pragma ignore unused variables?

        return (0, borrowRate);
    }
}
