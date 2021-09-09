pragma solidity ^0.4.24;
import "./RewardControl.sol";
contract RewardInitiation{
    // Contract to initialize reward distribution during TGE
    // To be used only once and destroyed after
    address public admin;
    RewardControl public rewardControl;
    
     modifier onlyOwner() 
    {
        require(msg.sender == admin, "Owner check failed");
        _;
    }
    constructor () 
    public 
    {
        admin = msg.sender;
        rewardControl = RewardControl(0x14716C982Fd8b7F1E8F0b4dbb496dCe438a29D93);
    }
    function newAdmin (address _admin) 
    public  
    returns(bool) 
    {
        admin = _admin;
        return true;
    }
    
    function refreshAll () 
    public 
    returns (bool) 
    {
        // for (uint256 i = 0; i < entities.length; i++) {
        //     for (uint256 j = 0; j < verifiedMarkets.length; j++) {
        //         rewardControl.refreshAlkSupplyIndex(verifiedMarkets[j], entities[i], true);
        //         rewardControl.refreshAlkBorrowIndex(verifiedMarkets[j], entities[i], true);
        //     }
            
        // }
        rewardControl.refreshAlkSpeeds();
        rewardControl.updateAlkSupplyIndex(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48,true);
        rewardControl.updateAlkSupplyIndex(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599,true);
        rewardControl.updateAlkSupplyIndex(0x1f52453B32BFab737247114D56d756A6c37dd9Ef,true);
        rewardControl.updateAlkSupplyIndex(0x6B175474E89094C44Da98b954EedeAC495271d0F,true);
        rewardControl.updateAlkBorrowIndex(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48,true);
        rewardControl.updateAlkBorrowIndex(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599,true);
        rewardControl.updateAlkBorrowIndex(0x1f52453B32BFab737247114D56d756A6c37dd9Ef,true);
        rewardControl.updateAlkBorrowIndex(0x6B175474E89094C44Da98b954EedeAC495271d0F,true);
        // update supply index for each market
        // update borrow index for each market
        // rewardControl.distributeBorrowerAlk(0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea, 0xB7bFbc2Cf0167Eb2945247C18dd7Caa28D9C39f0, true);
        rewardControl.distributeBorrowerAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x090e9FcF70d443dc7E9DE458973ea9Ad6140406f, true);
        rewardControl.distributeBorrowerAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839, true);
        rewardControl.distributeBorrowerAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x61A9D66c60e2b270205d674EF6924B4d6c5b6C46, true);
        rewardControl.distributeBorrowerAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xA1602181B46017cD06F3721d9fda79CD6e22CC60, true);
        rewardControl.distributeBorrowerAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xCA3E3Ff71782cda9fB5A7F2234287061f141e881, true);
        rewardControl.distributeBorrowerAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xCe3181BBb11cdAB1Cacf890324e3b0a0853BE8Eb, true);
        rewardControl.distributeBorrowerAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xe5Ac570506fF6289146CC43626D6Af540Aa67241, true);

        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x090e9FcF70d443dc7E9DE458973ea9Ad6140406f, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x0D492b8b6C24b8e593E9A4Ba12e213680ed0f4D5, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x235A7aF3a555C7C1E77F9c6a4930cDfb078A8582, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x44AAc8a5450461B39eaBfa1ca0758ff73498d7f9, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x52bbF1e34968162C68d5ff45334BC7653f4C9b56, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x61A9D66c60e2b270205d674EF6924B4d6c5b6C46, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0x86587327A9DBEa6EF2D4fbc142Be241801B858b2, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xB6F8797fa7F18dbC66f1eDC9Ae956A3764dC0B26, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xBe732807642db5eF501C64ca898C56D77950c294, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xCe3181BBb11cdAB1Cacf890324e3b0a0853BE8Eb, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xd5199Ce7f6A074089417Ea499356E0D1e7af6747, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xe5Ac570506fF6289146CC43626D6Af540Aa67241, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xe9b05dB21F255544721d0a58C1E9963d53D8BB95, true);
        rewardControl.distributeSupplierAlk(0x1f52453B32BFab737247114D56d756A6c37dd9Ef, 0xEAabD358C27f89721BeF1D4154966E77625227aB, true);

        rewardControl.distributeBorrowerAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839, true);
        rewardControl.distributeBorrowerAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x74C3b2d22ED5990B9aB1f77BD3054D4fD4AfCF96, true);
        rewardControl.distributeBorrowerAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xCA3E3Ff71782cda9fB5A7F2234287061f141e881, true);
        rewardControl.distributeBorrowerAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xCe3181BBb11cdAB1Cacf890324e3b0a0853BE8Eb, true);
        rewardControl.distributeBorrowerAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xd00124FBF72511F0B0B489503d699a153C87b16A, true);
        rewardControl.distributeBorrowerAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xe5Ac570506fF6289146CC43626D6Af540Aa67241, true);

        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x0D492b8b6C24b8e593E9A4Ba12e213680ed0f4D5, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x0EA4A285E1353F490eC7f473AB3174Cac71cF79a, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x44AAc8a5450461B39eaBfa1ca0758ff73498d7f9, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x52bbF1e34968162C68d5ff45334BC7653f4C9b56, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x56EFf193DFEd7D324056A433370D02664a656bf8, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x5A102966bA0ff184E16f5c7dB38A976074B7336D, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x700AA70308e028E6b168F872E4c6c05b5d69d861, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x74C3b2d22ED5990B9aB1f77BD3054D4fD4AfCF96, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x82Ff9E428ad69F54F4C0251D13607AF7DA8bd91E, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0x86587327A9DBEa6EF2D4fbc142Be241801B858b2, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xb0353d0A6690B0De6C50F00A1dd4D3B227fF596b, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xCe3181BBb11cdAB1Cacf890324e3b0a0853BE8Eb, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xd00124FBF72511F0B0B489503d699a153C87b16A, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xd5199Ce7f6A074089417Ea499356E0D1e7af6747, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xD7DDBE040c807f1e5F0555e6df986f90e7Fa4D40, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xe5Ac570506fF6289146CC43626D6Af540Aa67241, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xe9b05dB21F255544721d0a58C1E9963d53D8BB95, true);
        rewardControl.distributeSupplierAlk(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599, 0xEb4d9c6614fE4d4D4ada2565a6D895ba3Ea08796, true);

        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839, true);
        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x52bbF1e34968162C68d5ff45334BC7653f4C9b56, true);
        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x52dEF6C112BfFC66fC8C8258539d4d8C30c5000C, true);
        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x61A9D66c60e2b270205d674EF6924B4d6c5b6C46, true);
        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x74C3b2d22ED5990B9aB1f77BD3054D4fD4AfCF96, true);
        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x82Ff9E428ad69F54F4C0251D13607AF7DA8bd91E, true);
        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xA1602181B46017cD06F3721d9fda79CD6e22CC60, true);
        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xCA3E3Ff71782cda9fB5A7F2234287061f141e881, true);
        rewardControl.distributeBorrowerAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xCe3181BBb11cdAB1Cacf890324e3b0a0853BE8Eb, true);
        
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x005d64b3Fedd6d53EDf19142087D51c7ac6ba595, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x52dEF6C112BfFC66fC8C8258539d4d8C30c5000C, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x61A9D66c60e2b270205d674EF6924B4d6c5b6C46, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x74C3b2d22ED5990B9aB1f77BD3054D4fD4AfCF96, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x82Ff9E428ad69F54F4C0251D13607AF7DA8bd91E, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0x86587327A9DBEa6EF2D4fbc142Be241801B858b2, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xA1602181B46017cD06F3721d9fda79CD6e22CC60, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xA7E5a837382C4B2A484BD2AFAdc8B5A5f6d74e87, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xB6F8797fa7F18dbC66f1eDC9Ae956A3764dC0B26, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xbE6E6f4D907fB5d525A8C19132F1d90c4Bd01DE2, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xc00AC4de5BBE235135E67ba58bDe41d4d863f6B8, true);
        rewardControl.distributeSupplierAlk(0x6B175474E89094C44Da98b954EedeAC495271d0F, 0xCe3181BBb11cdAB1Cacf890324e3b0a0853BE8Eb, true);
        
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x44AAc8a5450461B39eaBfa1ca0758ff73498d7f9, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x52bbF1e34968162C68d5ff45334BC7653f4C9b56, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x900957d7558268F7C6466F0A62CA1226adeA3d0d, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xA1602181B46017cD06F3721d9fda79CD6e22CC60, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xc99D877Ba0473f9Ed885B7655f152578BE475FA2, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xCA3E3Ff71782cda9fB5A7F2234287061f141e881, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xCC4C14b6B2CeEb111a80Eb01CE879009c3c9f4F9, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xCCEfA6cC02EEf6334AdE9439D539eee9997a9c37, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xCe3181BBb11cdAB1Cacf890324e3b0a0853BE8Eb, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xd00124FBF72511F0B0B489503d699a153C87b16A, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xd5199Ce7f6A074089417Ea499356E0D1e7af6747, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xD7DDBE040c807f1e5F0555e6df986f90e7Fa4D40, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xe5Ac570506fF6289146CC43626D6Af540Aa67241, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xEAabD358C27f89721BeF1D4154966E77625227aB, true);
        rewardControl.distributeBorrowerAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xEb4d9c6614fE4d4D4ada2565a6D895ba3Ea08796, true);
        
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x057532933627B16d7deD57921f58a0C1ECf8D63c, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x0D492b8b6C24b8e593E9A4Ba12e213680ed0f4D5, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x1945A20D9be1246662e10Fa9A29d93609EB613e8, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x44AAc8a5450461B39eaBfa1ca0758ff73498d7f9, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x66390744C04D9CE7402062AAdd3925e9420f83D9, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x6A04941De896E4215Eeb8e6eb1b72AD2904D2402, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x750c31d2290c456FcCA1c659b6AdD80e7A88f881, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x7F0d52238DE604e064dC5EA11b479E79ec330116, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x86587327A9DBEa6EF2D4fbc142Be241801B858b2, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x8Bc3b61825F7aF1F683a205b05139143Bcef4fB7, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0x900957d7558268F7C6466F0A62CA1226adeA3d0d, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xA1602181B46017cD06F3721d9fda79CD6e22CC60, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xb0353d0A6690B0De6C50F00A1dd4D3B227fF596b, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xc85ef6C29fFA2F9FC5504433a350103e6237ADb2, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xc99D877Ba0473f9Ed885B7655f152578BE475FA2, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xCA3E3Ff71782cda9fB5A7F2234287061f141e881, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xCC4C14b6B2CeEb111a80Eb01CE879009c3c9f4F9, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xCCEfA6cC02EEf6334AdE9439D539eee9997a9c37, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xCe3181BBb11cdAB1Cacf890324e3b0a0853BE8Eb, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xD3efD2c80419714Aa81839b736F89585116951e3, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xe5Ac570506fF6289146CC43626D6Af540Aa67241, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xE90eFD8607e13cb8672Df8618368e1cC7B4435cf, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xEA82f43A5544BA01B4861Df712dd2000c7E48827, true);
        rewardControl.distributeSupplierAlk(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48, 0xEAabD358C27f89721BeF1D4154966E77625227aB, true);
        return true;
    }

    function close() 
    public 
    onlyOwner
    { 
        selfdestruct(admin); 
    }
                                
}