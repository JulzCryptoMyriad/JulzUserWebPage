const JulzPay = require('../artifacts/src/contracts/JulzPay.sol/JulzPay.json');
const {ethers} = require('ethers');

let owner = "0xaf796D06C7Ffc6231a59adBaF9B1aDf737ECCcA4";//random address to test
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";


async function deploy(user, deposit, signer) {
  const factory = new ethers.ContractFactory(JulzPay.abi, JulzPay.bytecode, signer);

  console.log('Deploying JulzPay...');
  const contract = factory.deploy(owner, user.checked, false, user.treasury, user.withdrawTokenAddress, WETH_ADDR, {
    value: ethers.utils.parseEther(deposit)
  })
  console.log('SecondDeploying msg JulzPay...');
  console.log('tx:', contract.deployTransaction);
  await contract.deployed();

  console.log('JulzPay deployed to:', contract.address);
   return {address:contract.address, abi: contract.interface};
}

module.exports = {
    deploy
  }