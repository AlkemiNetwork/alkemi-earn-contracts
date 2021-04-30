# Alkemi Earn Protocol

![GitHub](https://img.shields.io/github/license/project-alkemi/alkemi-earn-protocol) [![Build Status](https://travis-ci.com/project-alkemi/alkemi-earn-protocol.svg?branch=master)](https://travis-ci.com/project-alkemi/alkemi-earn-protocol) [![CircleCI](https://circleci.com/bb/project-alkemi/alkemi-earn-protocol/tree/master.svg?style=svg)](https://app.circleci.com/pipelines/bitbucket/project-alkemi/alkemi-earn-protocol/tree/master)[![MythXBadge](https://badgen.net/https/api.mythx.io/v1/projects/bdc732b7-27d2-4a17-be68-0a1f842ed64b/badge/data?cache=300&icon=https://raw.githubusercontent.com/ConsenSys/mythx-github-badge/main/logo_white.svg)](https://docs.mythx.io/dashboard/github-badges)

![GitHub stars](https://img.shields.io/github/stars/project-alkemi/alkemi-earn-protocol?style=social&label=star) ![GitHub forks](https://img.shields.io/github/forks/project-alkemi/alkemi-earn-protocol?style=social&label=fork) ![GitHub watchers](https://img.shields.io/github/watchers/project-alkemi/alkemi-earn-protocol?style=social&label=watch) ![GitHub followers](https://img.shields.io/github/followers/project-alkemi?label=follow&style=social)

> Implementation of Alkemi Earn Protocol in Solidity.
> [earn.alkemi.network](https://earn.alkemi.network/)

![Liquidity Dashboard](https://raw.githubusercontent.com/project-alkemi/alkemi-reserve-contracts/master/docs/assets/liquidity-dashboard2.gif)

## Table of Contents

- [Get Started](#get-started)
  - [Local development](#local-development)
- [Testing](#testing)
  - [Code Linting](#code-linting)
- [Networks](#networks)
  - [Mainnets](#mainnet-deployments)
    - [Ethereum Mainnet](#ethereum-mainnet)
  - [Testnets](#testnet-deployments)
    - [Kovan Testnet](#kovan-testnet)
    - [Rinkeby Testnet](#rinkeby-testnet)
    - [Ropsten Testnet](#ropsten-testnet)
- [Documentation](#documentation)
- [Issues](#issues)
- [License](#license)

---

## Get Started

For local development of `alkemi-earn-protocol` you can setup the development environment on your machine.

### Local development

For local development it is recommended to use [ganache](http://truffleframework.com/ganache/) to run a local development chain. Using the ganache simulator no full Ethereum node is required.

As a pre-requisite, you need:

- Node.js
- npm

Clone the project and install all dependencies:

    git clone git@github.com:project-alkemi/alkemi-earn-protocol.git
    cd alkemi-earn-protocol/

    # install project dependencies
    $ npm i

Compile the solidity contracts:

    $ npm run compile

![](https://raw.githubusercontent.com/project-alkemi/alkemi-earn-contracts/master/docs/assets/alk-compile.gif)

In a new terminal, launch an Ethereum RPC client, we use the default ganache-cli command to configure and run a local development ganache:

    $ npm run ganache

Switch back to your other terminal and deploy the contracts:

    $ npm run deploy

## Testing

Run tests with:

    $ npm run test

### Code Linting

Linting is setup for `JavaScript` with [ESLint](https://eslint.org) & Solidity with [Solhint](https://protofire.github.io/solhint/) and [Prettier](https://prettier.io/).

    # lint solidity contracts
    $ npm run prettier:contracts

    # lint tests
    $ npm run lint:tests

Code style is enforced through the CI test process, builds will fail if there're any linting errors.

## Networks

### Mainnet Deployments

#### Ethereum Mainnet

<table>
	<tr>
   		<th>Contract Name</th>
    	<th>Contract Address</th>
	</tr>
	<tr>
		<td> MoneyMarket </td>
		<td> 0x397c315d64D74d82A731d656f9C4D586D200F90A </td>
		<!-- Money market: 0x3c6513d4d0de82d42ea30593a86273e9607f66a0
		Money Market V1.1: 0x8770B2a109AEE8CDbe278FaE6CaE5Aa4Bcd13E1c
		Admin Upgradeability Proxy: 0x397c315d64D74d82A731d656f9C4D586D200F90A
		Proxy Admin: 0x94dB9B9d725a39F01816987deDC6fd00d58DcE65 -->
	</tr>
	<tr>
		<td> Liquidator </td>
		<td> 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839 </td>
	</tr>
	<tr>
		<td> DAI </td>
		<td> 0x6b175474e89094c44da98b954eedeac495271d0f </td>
	</tr>
	<tr>
		<td> DAIRateModel </td>
		<td> 0x95C45786B117e5FF09029D9CB71Aafe278264A3b </td>
	</tr>
	<tr>
		<td> DAIPriceFeed </td>
		<td> 0x773616E4d11A78F511299002da57A0a94577F1f4 </td>
	</tr>
    <tr>
    	<td> USDC </td>
    	<td> 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 </td>
    </tr>
    <tr>
    	<td> USDCRateModel </td>
    	<td> 0x95C45786B117e5FF09029D9CB71Aafe278264A3b </td>
    </tr>
	<tr>
    	<td> USDCPriceFeed </td>
    	<td> 0x986b5E1e1755e3C2440e960477f25201B0a8bbD4 </td>
    </tr>
    <tr>
    	<td> WBTC </td>
    	<td> 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 </td>
    </tr>
    <tr>
    	<td> WBTCRateModel </td>
    	<td> 0x976704A8949b82687d6e48b5FCe4030aab7c2e4F </td>
    </tr>
	<tr>
    	<td> WBTCPriceFeed </td>
    	<td> 0xdeb288F737066589598e9214E782fa5A8eD689e8 </td>
    </tr>
	<tr>
    	<td> WETH </td>
    	<td> 0x1f52453b32bfab737247114d56d756a6c37dd9ef </td>
    </tr>
    <tr>
    	<td> WETHRateModel </td>
    	<td> 0x6ad4333758188a9c0c464447f857add59e7b936c </td>
    </tr>
	<tr>
    	<td> ChainLink Oracle </td>
    	<td> 0x2f83073131efc90693b90cdf3fa1fdd0f7030e05 </td>
    </tr>

</table>

### Testnet Deployments

#### Kovan Testnet

<table>
	<tr>
   		<th>Contract Name</th>
    	<th>Contract Address</th>
	</tr>
	<tr>
		<td> MoneyMarket </td>
		<td> 0x87F8D2fDeFD6Ebd0D4d03719C1DE10f4aDE2C7f5 </td>
	</tr>
	<tr>
		<td> Liquidator </td>
		<td> 0xeA124B4d586528868F7D8431CD0eBcB074886E61 </td>
	</tr>
	<tr>
		<td> DAI </td>
		<td> 0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa </td>
	</tr>
	<tr>
		<td> DAIRateModel </td>
		<td> 0x84B16818A31576d45df65bb565DA94B3Dd98812B </td>
	</tr>
	<tr>
		<td> DAIPriceFeed </td>
		<td> 0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541 </td>
	</tr>
    <tr>
    	<td> USDC </td>
    	<td> 0xb7a4f3e9097c08da09517b5ab877f7a917224ede </td>
    </tr>
    <tr>
    	<td> USDCRateModel </td>
    	<td> 0x84B16818A31576d45df65bb565DA94B3Dd98812B </td>
    </tr>
	<tr>
    	<td> USDCPriceFeed </td>
    	<td> 0x64EaC61A2DFda2c3Fa04eED49AA33D021AeC8838 </td>
    </tr>
    <tr>
    	<td> WBTC </td>
    	<td> 0xd3a691c852cdb01e281545a27064741f0b7f6825 </td>
    </tr>
    <tr>
    	<td> WBTCRateModel </td>
    	<td> 0xE5FE0F259aBa3f8469526b8bB6Ce3170487a1984 </td>
    </tr>
	<tr>
    	<td> WBTCPriceFeed </td>
    	<td> 0xF4eE06480Cf3399D885639157A5a8CdE21F6934A </td>
    </tr>
    <tr>
    	<td> WETH </td>
    	<td> 0x22f0596d9Ac79b85BdA6723E3192BA258346C3d5 </td>
		<!-- 0x5eca15b12d959dfcf9c71c59f8b467eb8c6efd0b -->
    </tr>
    <tr>
    	<td> WETHRateModel </td>
    	<td> 0x6989eE17E68a3F3Bfd84360f17Cf85eb2f0D7A3d </td>
    </tr>
  	<tr>
    	<td> ChainLink Oracle </td>
    	<td> 0x75e21D4b5A9282D7F64F11AD4Ef4b488518106F3 </td>
    </tr>
    <tr>
    	<td> PriceOracle </td>
    	<td> 0xf86aa886ff5FFe808462eBA865e8099aa318E46F </td>
    </tr>
    <tr>
    	<td> PriceOracleProxy </td>
    	<td> 0xE19eD74618466d8eD5F2E7f89A41328DFa8e46F5 </td>
    </tr>

</table>

#### Rinkeby Testnet

<table>
	<tr>
   		<th>Contract Name</th>
    	<th>Contract Address</th>
	</tr>
	<tr>
		<td> MoneyMarket Upgrade Proxy </td>
		<td> 0xccFcc25E498c40c67baD046F55bDB01F0eeDA870 </td>
	</tr>
	<tr>
		<td> MoneyMarket Implementation</td>
		<td> 0xebBC2cd4b29c41a94E14f43260Fc20C44315bd5C </td>
	</tr>
	<tr>
		<td> Liquidator </td>
		<td> 0xC5D133281F66041f6c5330c72ce696D9A847EC0F </td>
	</tr>
    <tr>
    	<td> USDC </td>
    	<td> 0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b </td>
    </tr>
    <tr>
    	<td> USDCRateModel </td>
    	<td> 0xb3c80B7D08C1D34847917b11af48269345B2632F </td>
    </tr>
    <tr>
    	<td> USDCPriceFeed </td>
    	<td> 0xdCA36F27cbC4E38aE16C4E9f99D39b42337F6dcf </td>
    </tr>
    <tr>
    	<td> WBTC </td>
    	<td> 0x577d296678535e4903d59a4c929b718e1d575e0a </td>
    </tr>
    <tr>
    	<td> WBTCRateModel </td>
    	<td> 0x47A36b3fF09f2e5B2e50a4e3eA8066bAF18759d6 </td>
    </tr>
    <tr>
    	<td> WBTCPriceFeed </td>
    	<td> 0x2431452A0010a43878bF198e170F6319Af6d27F4 </td>
    </tr>
    <tr>
    	<td> WETH </td>
    	<td> 0x9e3865F0A681F2356BcF5Cf6b978F0a773716886 </td>
    </tr>
    <tr>
    	<td> WETHRateModel </td>
    	<td> 0x88f94067e44E4b2b814C11Ba5c72232faea3f029 </td>
    </tr>
    <tr>
    	<td> WETHPriceFeed </td>
    	<td> 0x9e3865F0A681F2356BcF5Cf6b978F0a773716886 </td>
    </tr>
    <tr>
    	<td> DAI </td>
    	<td> 0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea </td>
    </tr>
    <tr>
    	<td> DAIRateModel </td>
    	<td> 0xb3c80B7D08C1D34847917b11af48269345B2632F </td>
    </tr>
    <tr>
    	<td> DAIPriceFeed </td>
    	<td> 0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D </td>
    </tr>

  <tr>
  	<td> PriceOracle </td>
  	<td> 0x7C45578C154c9c00DE843d9874a5220E7089c581
	</td>
  </tr>
  <tr>
  	<td> PriceOracleProxy </td>
  	<td> 0x994cb3eD851e05BfeE1A5c069337eC9486829E90 </td>
  </tr>
  <tr>
  	<td> ChainLink </td>
  	<td> 0xFF2A446d3134769c8a9689c1F5b4CE5416366895 </td>
  </tr>

</table>

#### Ropsten Testnet

<table>
	<tr>
   		<th>Contract Name</th>
    	<th>Contract Address</th>
	</tr>
	<tr>
		<td> MoneyMarket </td>
		<td> 0x877fc552EE05123A9532Da4511aaA5c6F212ECc0 </td>
	</tr>
	<tr>
		<td> MoneyMarket Proxy Backend </td>
		<td> 0xC3B40aca9Ba564948Dfdb90F13D7409766136D1A </td>
	</tr>
	<tr>
		<td> Liquidator </td>
		<td> 0xc3ACc4A629545ED6Db6135Ca319ADAA012605028 </td>
	</tr>
	<tr>
		<td> USDC </td>
		<td> 0x0D9C8723B343A8368BebE0B5E89273fF8D712e3C </td>
	</tr>
	<tr>
		<td> USDCRateModel </td>
		<!-- <td> 0x977E1AD0987dEA9ea880f711FD5a3cA9b37D4f39 </td> -->
		<td> 0x562E25eCbf8A5287b31d81f6020AADe698030BcA </td>
	</tr>
	<tr>
		<td> USDCPriceFeed </td>
		<td> 0xB8784d2D77D3dbaa9cAC7d32D035A6d41e414e9c </td>
	</tr>
    <tr>
    	<td> WBTC </td>
    	<td> 0xBde8bB00A7eF67007A96945B3a3621177B615C44 </td>
    </tr>
    <tr>
    	<td> WBTCRateModel </td>
    	<!-- <td> 0x8E494bcd29b45A194335b91947d09ff3643437F5 </td> -->
    	<td> 0xd26C97d0A5665c86E233659548c17B018ba4E086 </td>
    </tr>
    <tr>
    	<td> WBTCPriceFeed </td>
    	<td> 0xECf6936AD6030A1Aa4f2055Df44149B7846628F7 </td>
    </tr>
    <tr>
    	<td> WETH </td>
    	<!-- <td> 0xc778417E063141139Fce010982780140Aa0cD5Ab </td> -->
    	<td> 0x72E79E602F345aACd9C683106782c08eAf92f0D7 </td>
    </tr>
    <tr>
    	<td> WETHRateModel </td>
    	<!-- <td> 0x8E494bcd29b45A194335b91947d09ff3643437F5 </td> -->
    	<td> 0xb92815aE038a21cd830576a41812A2cea8B85447 </td>
    </tr>
    <tr>
    	<td> WETHPriceFeed </td>
    	<td> 0x72E79E602F345aACd9C683106782c08eAf92f0D7 </td>
    </tr>
    <tr>
    	<td> DAI </td>
    	<!-- <td> 0x31F42841c2db5173425b5223809CF3A38FEde360 </td> -->
    	<!-- The above is Compound's DAI token which does not work anymore -->
    	<!-- Below is a custom token created for Alkemi in Ropsten as a replacement for DAI in ropsten -->
    	<td> 0xE8EF14A5cBAADa1542D0341ec4a76b611BA209aF </td>
    </tr>
    <tr>
    	<td> DAIRateModel </td>
    	<!-- <td> 0x977E1AD0987dEA9ea880f711FD5a3cA9b37D4f39 </td> -->
    	<td> 0x562E25eCbf8A5287b31d81f6020AADe698030BcA </td>
    </tr>
    <tr>
    	<td> DAIPriceFeed </td>
    	<td> 0x24959556020AE5D39e5bAEC2bd6Bf12420C25aB5 </td>
    </tr>
    <tr>
    	<td> PriceOracle </td>
    	<td> 0xd3e54d04023c537ad1E9286E6D3597839F84466D
  	</td>
    </tr>
    <tr>
    	<td> PriceOracleProxy </td>
    	<td> 0x726e35841f79A3ED7FA06e9a1750018D19b4C951 </td>
    </tr>
    <tr>
    	<td> ChainLink Oracle </td>
    	<td> 0x309a7425e7Ba1cB1710B0a1A4251e835bF8A8235 </td>
    </tr>
</table>

## Documentation

- [Contracts Documentation](https://docs.alkemi.network/)

## Issues

If you come across an issue with Alkemi Protocol contracts, do a search in the [Issues](https://github.com/project-alkemi/alkemi-earn-protocol/issues) tab of this repo to make sure it hasn't been reported before. Follow these steps to help us prevent duplicate issues and unnecessary notifications going to the many people watching this repo:

- If the issue you found has been reported and is still open, and the details match your issue, give a "thumbs up" to the relevant posts in the issue thread to signal that you have the same issue. No further action is required on your part.
- If the issue you found has been reported and is still open, but the issue is missing some details, you can add a comment to the issue thread describing the additional details.
- If the issue you found has been reported but has been closed, you can comment on the closed issue thread and ask to have the issue reopened because you are still experiencing the issue. Alternatively, you can open a new issue, reference the closed issue by number or link, and state that you are still experiencing the issue. Provide any additional details in your post so we can better understand the issue and how to fix it.

## License

    Copyright (c) 2020 Alkemi

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
