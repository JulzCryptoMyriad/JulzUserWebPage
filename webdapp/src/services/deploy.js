const {ethers} = require('hardhat');

let owner = "0xaf796D06C7Ffc6231a59adBaF9B1aDf737ECCcA4";//random address to test

async function deploy(user,deposit) {
  console.log("getting this as params",user,deposit);
  const JulzPay = await ethers.getContractFactory('JulzPay');
  console.log('Deploying JulzPay...');
  const contract = await JulzPay.deploy(owner, user.checked, false, user.treasury, user.withdrawTokenAddress, {value: deposit});
  await contract.deployed();
  console.log('JulzPay deployed to:', contract.address);
  return {address:contract.address, abi: contract.interface};
}
//deploy({treasury:"0xaf796D06C7Ffc6231a59adBaF9B1aDf737ECCcA4", monthly:false,withdrawToken:"0xaf796D06C7Ffc6231a59adBaF9B1aDf737ECCcA4"},ethers.utils.parseEther("0"));
module.exports = {
    deploy
  }