pragma solidity ^0.4.24;

contract RewardControlInterface {
    function refreshAlkIndex(address market, address participant) external;

    function claimAlk(address holder) external;

}
