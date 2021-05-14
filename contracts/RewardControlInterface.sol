pragma solidity ^0.4.24;

contract RewardControlInterface {
    function refreshAlkIndex(address market, address participant) public;

    function claimAlk(address holder) public;

}
