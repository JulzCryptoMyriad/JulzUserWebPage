const {deploy} =  require('./deploy.js') ;
const db = require('../services/db');
const {abi} = require('../artifacts/src/contracts/JulzPay.sol/JulzPay.json')
const {ethers} = require('hardhat');


async function getMultiple(){
  const data = await db.query('SELECT * FROM users');
  const meta = {page: 1};

  return {
    data,
    meta
  }
}

async function create(user){
    validateCreate(user);
  
    const result = await db.query(
      "INSERT INTO users (email, password, contractAddress, restriction, treasuryAddress, withdrawTokenAddress) VALUES ('"+user.email+"', '"+user.password+"', '"+user.contractAddress+"', '"+user.checked+"', '"+user.treasury+"', '"+user.withdrawTokenAddress+"')", 
      []
    );

    let message = 'Error in creating user';
  
    if (result.affectedRows) {
      const deposit = (!user.monthly)?ethers.utils.parseEther("0"):ethers.utils.parseEther("0.5");

      const contract = await deploy(user, deposit);
      await contract;
      const result2 = await db.query(
        "UPDATE users SET contractAddress = '"+contract.address+"', abi='"+JSON.stringify(abi)+"' Where idusers = "+result.insertId+"", 
        []
      ); 
      if(result2.affectedRows){
        message = 'user created successfully';
      }
    }
  
    return {message};
}

function validateCreate(user) {
    let messages = [];
    
    if (!user) {
      messages.push('No object is provided');
    }
  
    if (!user.email) {
      messages.push('user is empty');
    }
  
    if (!user.password) {
      messages.push('user is empty');
    }
  
    if (messages.length) {
      let error = new Error(messages.join());
      error.statusCode = 400;
  
      throw error;
    }
  }

  async function login(user){
    const data = await db.query(
        "select * from  users where email = '"+user.email+"' and password = '"+user.password+"'", 
        [ ]
      );
      let message =  false;
    
      if (data.length > 0) {
        message = true;
      }
    
      return {data};

  }

module.exports = {
  getMultiple,
  create,
  login
}