const db = require('../services/db');
const {abi} = require('../artifacts/src/contracts/JulzPay.sol/JulzPay.json');


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
      "INSERT INTO users (email, password, contractAddress, restriction, treasuryAddress, withdrawTokenAddress,lastWithdraw, withdrawn) VALUES ('"+user.email+"', '"+user.password+"', '"+user.contractAddress+"', '"+user.checked+"', '"+user.treasury+"', '"+user.withdrawTokenAddress+"',sysdate(), 0)", 
      []
    );

    let message = 'Error in creating user';
  
    if (result.affectedRows) {
        message = 'user created successfully';     
    }
  
    return {message: message,  id: result.insertId};
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
    let txsPending, total;
    const data = await db.query(
        "SELECT *, CAST(abi as CHAR) charABI,Datediff(DATE_ADD(lastWithdraw, INTERVAL 30 DAY),sysdate())  as nextWithdraw FROM  users where email = '"+user.email+"' and password = '"+user.password+"'", 
        [ ]
      );
      let message =  false;
    
      if (data.length > 0) {
        message = true;
        txsPending = await db.query(
          "select distinct date, amount,hash from transactions where idusers = "+ data[0].idusers+" and withdraw = false", 
          [ ]
        );
        total = await db.query("select Sum(amount) total from transactions where idusers = "+ data[0].idusers+" and withdraw = false group by idusers;",[]);
        if (total.length <1)total=[{total:0}]
      }
    
      return {data, txs:txsPending, total};

}

async function update(data){
  const result2 = await db.query(
    "UPDATE users SET contractAddress = '"+data.address+"', abi='"+JSON.stringify(abi)+"' Where idusers = "+data.id+"", 
    []
  ); 
    let message =  "There was an error on the update";

    if (result2.affectedRows) {
      message = "All went great on the update";
    }

    return message;

}

async function withdraw(data){
  
  let txsPending, total, result;
  const result2 = await db.query(
    "UPDATE users SET withdrawn = withdrawn+"+data.amount+", lastwithdraw = date(sysdate()) Where idusers = "+data.id+"", 
    []
  ); 
  const result3 = await db.query(
    "update transactions set withdraw = true where idusers = "+data.id+"", 
    []
  ); 
    let message =  "There was an error on the update";

    if (result2.affectedRows) {
      message = "All went great on the update";
      txsPending = await db.query(
        "select distinct date, amount,hash from transactions where idusers = "+ data.id+" and withdraw = false", 
        [ ]
      );
      result = await db.query(
        "SELECT *, CAST(abi as CHAR) charABI,Datediff(DATE_ADD(lastWithdraw, INTERVAL 30 DAY),sysdate())  as nextWithdraw FROM  users where idusers = "+ data.id+"", 
        [ ]
      );
      total = await db.query("select Sum(amount) total from transactions where idusers = "+ data.id+" and withdraw = false group by idusers;",[]);
      if (total.length <1)total=[{total:0}]
    }
console.log('mando', result, total);
    return {data: result, txs:txsPending, total};

}

module.exports = {
  getMultiple,
  create,
  login,
  update,
  withdraw

}