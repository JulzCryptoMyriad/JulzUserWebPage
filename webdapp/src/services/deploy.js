const {ethers} = require('ethers');

let owner = "0xaf796D06C7Ffc6231a59adBaF9B1aDf737ECCcA4";//random address to test
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
async function deploy(user,deposit) {
  const JulzPay = await ethers.getContractFactory('JulzPay');
  console.log('Deploying JulzPay...');
  const contract = await JulzPay.deploy(owner, user.checked, false, user.treasury, user.withdrawTokenAddress, WETH_ADDR, {value: deposit});
  await contract.deployed();
  console.log('JulzPay deployed to:', contract.address);
  return {address:contract.address, abi: contract.interface};
}

module.exports = {
    deploy
  }