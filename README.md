# JulzUserWebPage
Web site for widget clients to register and mange their account

## Quick Start
Follow these steps:
1. Clone this repo
2.  ```cd webdapp```
3. Install dependencies: ```npm i```
4. Set up a MySQL instance with the script on `./migrations/`
5. Set up webdapp/.env file with the following keys: 
    `FORKING_URL`, 
    `RINKEBY_URL`,
    `DATABASE_HOST`,
    `DATABASE_PASS`,
    `DATABASE_NAME`, and
    `DATABASE_USER` 
6. Run the tests: ```npm test``` 

## To Run
You must run both the front end and the back end as follows:
* Front end:   ```npm start```
* Back End: ```nodemon server/server.js```
Make sure to run a local fork of mainnet to ensure all external contracts will be found. You can do so with `npx hardhat node --fork url`
