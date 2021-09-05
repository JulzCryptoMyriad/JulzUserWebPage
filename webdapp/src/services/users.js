const db = require('../services/db');

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
      "INSERT INTO users (email, password, contractAddress, restriction, treasuryAddress) VALUES ('"+user.email+"', '"+user.password+"', '"+user.contractAddress+"', '"+user.checked+"', '"+user.treasury+"')", 
      []
    );
  
    let message = 'Error in creating user';
  
    if (result.affectedRows) {
      message = 'user created successfully';//create settings
    }
  
    return {message};
  }

function validateCreate(user) {
    let messages = [];
  
    console.log(user);
  
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
    
      return {message};

  }

module.exports = {
  getMultiple,
  create,
  login
}