const express = require('express');
const cors = require('cors');
const app = express(); 
const port = process.env.PORT || 5000; 
const users = require('../services/users');

app.use(cors());
app.use(express.json());

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 

// create a GET route
app.get('/express_backend', (req, res) => { 
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 

app.get('/users', async (req, res) => { 
  try {
    res.json(await users.getMultiple());
  } catch (err) {
    console.error(`Error while getting users `, err.message);
  }
}); 

app.post('/login', async (req, res) => { 
  try {
    res.json(await users.login(req.body));
  } catch (err) {
    console.error(`Error while login user `, err.message);
  }
}); 

app.post('/create', async (req, res) => { 
  try {
    console.log('Im here');
    res.json(await users.create(req.body));
    console.log('im outa');
  } catch (err) {
    console.error(`Error while creating user `, err.message);
  }
}); 

app.post('/update', async (req, res) => { 
  try {
    res.json(await users.update(req.body));
  } catch (err) {
    console.error(`Error while updating user `, err.message);
  }
}); 
