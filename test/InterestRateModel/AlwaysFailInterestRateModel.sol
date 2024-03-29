pragma solidity ^0.4.24;

import "../../contracts/AlkemiRateModel.sol";

/**
 * @title An Interest Rate Model that always fails for tests
 * @author Compound
 */
contract AlwaysFailInterestRateModel is AlkemiRateModel {
    /**
     * @notice Always fails with an error
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

        return (1, 0);
    }

    /**
     * @notice Always fails with an error
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

        return (2, 0);
    }
}
