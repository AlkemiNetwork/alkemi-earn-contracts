pragma solidity ^0.4.24;

contract RewardControlInterface {
    function refreshAlkIndex(address market, address supplier) public;

    function claimAlk(address holder) public;

    function getCurrentBlockNumber() public view returns (uint);

    function getAlkAccrued(address participant) public view returns (uint);

    function getAlkAddress() public view returns (address);
}
