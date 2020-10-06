pragma solidity 0.4.24;

import "../node_modules/@chainlink/contracts/src/v0.4/interfaces/AggregatorV3Interface.sol";

contract ChainLink {
    
    mapping(address => AggregatorV3Interface) internal priceContractMapping;
    address public admin;

    /**
     * Sets the initial assets and admin
     */
    constructor() public {
        admin = msg.sender;
        priceContractMapping[0x31F42841c2db5173425b5223809CF3A38FEde360] = AggregatorV3Interface(0x24959556020AE5D39e5bAEC2bd6Bf12420C25aB5);
        priceContractMapping[0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C] = AggregatorV3Interface(0xB8784d2D77D3dbaa9cAC7d32D035A6d41e414e9c);
        priceContractMapping[0xBde8bB00A7eF67007A96945B3a3621177B615C44] = AggregatorV3Interface(0xECf6936AD6030A1Aa4f2055Df44149B7846628F7);
        priceContractMapping[0xc778417E063141139Fce010982780140Aa0cD5Ab] = AggregatorV3Interface(0x30B5068156688f818cEa0874B580206dFe081a03);
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
     * Returns the latest price
     */
    function getAssetPrice(address asset) public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceContractMapping[asset].latestRoundData();
        // If the round is not complete yet, timestamp is 0
        require(timeStamp > 0, "Round not complete");
        return (price);
    }
}