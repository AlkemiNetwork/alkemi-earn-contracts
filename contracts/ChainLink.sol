pragma solidity 0.4.24;

import "../node_modules/@chainlink/contracts/src/v0.4/interfaces/AggregatorV3Interface.sol";

contract ChainLink {
    
    mapping(address => AggregatorV3Interface) internal priceContractMapping;
    address public admin;
    bool public paused = false;

    /**
     * Sets the initial assets and admin
     */
    constructor() public {
        admin = msg.sender;
    }
    
    /**
     * Modifier to restrict functions only by admins
     */
    modifier onlyAdmin() {
        require(msg.sender == admin,"Only the Admin can perform this operation");
        _;
    }
    
    /**
     * Allows admin to add a new asset for price tracking
     */
    function addAsset(address assetAddress, address priceFeedContract) public onlyAdmin {
        priceContractMapping[assetAddress] = AggregatorV3Interface(priceFeedContract);
    }
    
    /**
     * Allows admin to remove an existing asset from price tracking
     */
    function removeAsset(address assetAddress) public onlyAdmin {
        priceContractMapping[assetAddress] = AggregatorV3Interface(address(0));
    }
    
    /**
     * Allows admin to change the admin of the contract
     */
    function changeAdmin(address newAdmin) public onlyAdmin {
        admin = newAdmin;
    }

    /**
     * Allows admin to pause and unpause the contract
     */
    function togglePause() public onlyAdmin {
        if (paused) {
            paused = false;
        }
        else {
            paused = true;
        }
    }

    /**
     * Returns the latest price
     */
    function getAssetPrice(address asset) public view returns (uint) {
        if(!paused && priceContractMapping[asset] != address(0)) {
            (
                uint80 roundID, 
                int price,
                uint startedAt,
                uint timeStamp,
                uint80 answeredInRound
            ) = priceContractMapping[asset].latestRoundData();
            // If the round is not complete yet, timestamp is 0
            require(timeStamp > 0, "Round not complete");
            if(price >0) {
                return (uint(price));
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    }

    function fallback() public payable {
        require(msg.sender.send(msg.value),"Fallback function initiated but refund failed");
    }
}