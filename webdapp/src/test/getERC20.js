const depositorAddrDAI = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";//blocknujmber: 11250730
const depositorAddrUSDT = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";//blocknumber: 13195099

async function getERC20(erc20, accts, type) {
    const richAccount = (type)? depositorAddrDAI: depositorAddrUSDT;
    const signer = await ethers.provider.getSigner(accts[0]);
    await signer.sendTransaction({ to: richAccount, value: ethers.utils.parseEther("100") });
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [richAccount]
    });
    depositorSigner = await ethers.provider.getSigner(richAccount);
    for (let i = 0; i < accts.length; i++) {
        try{
            if(type){
                await erc20.connect(depositorSigner).transfer(accts[i], ethers.utils.parseEther("100"));
            }else{
                await erc20.connect(depositorSigner).transfer(accts[i], ethers.utils.parseEther("100"));
            }
           
        }catch(ex){
            console.log('transfer failed');
        }
    }
}

module.exports = getERC20;