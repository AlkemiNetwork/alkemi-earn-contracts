pragma solidity 0.4.24;

contract RewardControlInterface {
    function refreshAlkSupplyIndex(address market, address supplier) external;

    function refreshAlkBorrowIndex(address market, address borrower) external;

    function claimAlk(address holder) external;

}
