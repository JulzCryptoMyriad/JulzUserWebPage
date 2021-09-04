const express = require('express');
const app = express(); 
const router = express.Router();
const port = process.env.PORT || 5000; 
const users = require('../services/users');

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 

// create a GET route
app.get('/express_backend', (req, res) => { 
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 

app.get('/users', (req, res) => { 
  try {
    res.json( users.getMultiple());
  } catch (err) {
    console.error(`Error while getting users `, err.message);
    next(err);
  }
}); 

router.get('/', async function(req, res, next) {
  try {
    res.json(await users.getMultiple());
  } catch (err) {
    console.error(`Error while getting users `, err.message);
    next(err);
  }
});