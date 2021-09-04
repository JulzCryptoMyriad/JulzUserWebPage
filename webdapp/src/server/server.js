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
