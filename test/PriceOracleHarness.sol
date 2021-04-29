pragma solidity ^0.4.24;

import "../contracts/ChainLink.sol";

contract PriceOracleHarness is ChainLink {

    mapping(address => uint) prices;

    /**
      * @notice Gets the price of a given asset
      * @dev fetches the price of a given asset
      * @param asset Asset to get the price of
      * @return the price scaled by 10**18, or zero if the price is not available
      */
    function getAssetPrice(address asset) public view returns (uint) {
        return prices[asset];
    }

    function harnessSetAssetPrice(address asset, uint assetPriceMantissa) public {
        prices[asset] = assetPriceMantissa;
    }

}


