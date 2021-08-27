pragma solidity 0.4.24;

contract RewardControlInterface {
    /**
     * @notice Refresh ALK supply index for the specified market and supplier
     * @param market The market whose supply index to update
     * @param supplier The address of the supplier to distribute ALK to
     * @param isVerified Verified / Public protocol
     */
    function refreshAlkSupplyIndex(
        address market,
        address supplier,
        bool isVerified
    ) external;

    /**
     * @notice Refresh ALK borrow index for the specified market and borrower
     * @param market The market whose borrow index to update
     * @param borrower The address of the borrower to distribute ALK to
     * @param isVerified Verified / Public protocol
     */
    function refreshAlkBorrowIndex(
        address market,
        address borrower,
        bool isVerified
    ) external;

    /**
     * @notice Claim all the ALK accrued by holder in all markets
     * @param holder The address to claim ALK for
     */
    function claimAlk(address holder) external;

    /**
     * @notice Claim all the ALK accrued by holder by refreshing the indexes on the specified market only
     * @param holder The address to claim ALK for
     * @param market The address of the market to refresh the indexes for
     * @param isVerified Verified / Public protocol
     */
    function claimAlk(
        address holder,
        address market,
        bool isVerified
    ) external;
}
