pragma solidity 0.4.24;

import "./AggregatorV3Interface.sol";
import "./EIP20Interface.sol";

contract ChainLink {
    mapping(address => AggregatorV3Interface) internal priceContractMapping;
    address public admin;
    bool public paused = false;
    address public wethAddress;
    AggregatorV3Interface public USDETHPriceFeed;
    uint256 constant expScale = 10**18;
    uint8 constant eighteen = 18;

    /**
     * Sets the admin
     * Add assets and set Weth Address using their own functions
     */
    constructor() public {
        admin = msg.sender;
    }

    /**
     * Modifier to restrict functions only by admins
     */
    modifier onlyAdmin() {
        require(
            msg.sender == admin,
            "Only the Admin can perform this operation"
        );
        _;
    }

    /**
     * Event declarations for all the operations of this contract
     */
    event assetAdded(address assetAddress, address priceFeedContract);
    event assetRemoved(address assetAddress);
    event adminChanged(address oldAdmin, address newAdmin);
    event wethAddressSet(address wethAddress);
    event contractPausedOrUnpaused(bool currentStatus);

    /**
     * Allows admin to add a new asset for price tracking
     */
    function addAsset(
        address assetAddress,
        address priceFeedContract
    ) public onlyAdmin {
        require(assetAddress != address(0) && priceFeedContract != address(0),"Asset or Price Feed address cannot be 0x00");
        priceContractMapping[assetAddress] = AggregatorV3Interface(
            priceFeedContract
        );
        emit assetAdded(assetAddress, priceFeedContract);
    }

    /**
     * Allows admin to remove an existing asset from price tracking
     */
    function removeAsset(address assetAddress) public onlyAdmin {
        require(assetAddress != address(0),"Asset or Price Feed address cannot be 0x00");
        priceContractMapping[assetAddress] = AggregatorV3Interface(address(0));
        emit assetRemoved(assetAddress);
    }

    /**
     * Allows admin to change the admin of the contract
     */
    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0),"Asset or Price Feed address cannot be 0x00");
        emit adminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    /**
     * Allows admin to set the weth address
     */
    function setWethAddress(address _wethAddress) public onlyAdmin {
        require(_wethAddress != address(0),"WETH address cannot be 0x00");
        wethAddress = _wethAddress;
        emit wethAddressSet(_wethAddress);
    }

    /**
     * Allows admin to pause and unpause the contract
     */
    function togglePause() public onlyAdmin {
        if (paused) {
            paused = false;
            emit contractPausedOrUnpaused(false);
        } else {
            paused = true;
            emit contractPausedOrUnpaused(true);
        }
    }

    /**
     * Returns the latest price scaled to 1e18 scale
     */
    function getAssetPrice(address asset) public view returns (uint256,uint8) {
        // Return 1 * 10^18 for WETH, otherwise return actual price
        if (!paused && asset == wethAddress) {
            return (expScale,eighteen);
        }
        // Capture the decimals in the ERC20 token
        uint8 assetDecimals = EIP20Interface(asset).decimals();
        if (!paused && priceContractMapping[asset] != address(0)) {
            (
                uint80 roundID,
                int256 price,
                uint256 startedAt,
                uint256 timeStamp,
                uint80 answeredInRound
            ) = priceContractMapping[asset].latestRoundData();
            // If the round is not complete yet, timestamp is 0
            require(timeStamp > 0, "Round not complete");
            // If the price data was not refreshed for the past 2 days, prices are considered stale
            require(timeStamp > (now - 2 days),"Stale data");
            // If answeredInRound is less than roundID, prices are considered stale
            require(answeredInRound >= roundID,"Stale Data");
            if (price > 0) {
                // Magnify the result based on decimals
                return (uint256(price),assetDecimals);
            } else {
                return (0,assetDecimals);
            }
        } else {
            return (0,assetDecimals);
        }
    }

    function() public payable {
        require(
            msg.sender.send(msg.value),
            "Fallback function initiated but refund failed"
        );
    }
}
