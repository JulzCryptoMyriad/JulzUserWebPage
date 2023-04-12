const depositorAddrDAI = "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503";//blocknumber: 11250730
const depositorAddrWETH = "0x741AA7CFB2c7bF2A1E7D4dA2e3Df6a56cA4131F3";//blocknumber: 13195099

async function getERC20(erc20, accts, isDai) {
    const richAccount = (isDai)? depositorAddrDAI: depositorAddrWETH;
    
    // Funds the richAccount with eth to pay for gas
    const signer = await ethers.provider.getSigner(accts[0]);
    await signer.sendTransaction({ to: richAccount, value: ethers.utils.parseEther("100") });
    
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [richAccount]
    });
    
    depositorSigner = await ethers.provider.getSigner(richAccount);
    
    for (let i = 0; i < accts.length; i++) {
        try {
            const tx = await erc20.connect(depositorSigner).approve(accts[i], ethers.utils.parseEther("100"));
            tx.wait();
            await erc20.connect(depositorSigner).transfer(accts[i], ethers.utils.parseEther("100"));
            
        } catch(ex) {
            console.log('account funding transfer failed', ex);
        }
    }
}

module.exports = getERC20;