const { assert } = require("chai");

const getERC20 = require("./getERC20");

const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const USDC_ADDR = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT_ADDR = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const WBTC_ADDR = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

const FEE_SIZE = 3;
function encodePath(path, fees) {
    if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match');
    }

    let encoded = '0x';
    for (let i = 0; i < fees.length; i++) {
        // 20 byte encoding of the address
        encoded += path[i].slice(2);
        // 3 byte encoding of the fee
        encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2);

    return encoded.toLowerCase();
}

describe("JulzPay dai preference", function() {
    let owner;
    let treasury;
    let monthly = true;
    const deposit = ethers.utils.parseEther("0.5");
    let withdrawToken = DAI_ADDR;
    beforeEach(async () => {
        owner = ethers.provider.getSigner(0);
        treasury = ethers.provider.getSigner(1);
        const JulzPay = await ethers.getContractFactory("JulzPay");
        contract = await JulzPay.deploy(owner.getAddress(), monthly, false, treasury.getAddress(), withdrawToken, WETH_ADDR, {value: deposit});
        await contract.deployed();
    });

    it("should not be funded initially if monthly is false", async function() {
        const balance = await ethers.provider.getBalance(contract.address);
        assert.equal(Number(balance.toString()), 0);
    });

    it("storage must be set initially", async function(){
        const token = await contract.withdrawToken()
        assert.equal(await contract.treasury(), await treasury.getAddress());
        assert.equal(await contract.monthly(), monthly);
        assert.equal(token.toString().toLowerCase(), withdrawToken.toString().toLowerCase());
    });


    describe("On Destruct", () => {
        it("should not revert if  owner calls", async () => {
            let ex;
            try {
                await contract.connect(owner).destruct();
            }
            catch (_ex) {
                ex = _ex;
            }
            assert.isUndefined(ex);
        });

        it("should revert if non owner calls", async () => {
            let ex;
            try {
                await contract.connect(treasury).destruct();
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "Attempted to destroy it!");
        });
    });

    describe("Fund Single Depositor", function () {
        let weth, dai, usdc, tether, wbtc;
        before(async () => {
            dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);
            aDai = await ethers.getContractAt("IERC20Minimal", "0x028171bCA77440897B824Ca71D1c56caC55b68A3");
            aWETH = await ethers.getContractAt("IERC20", "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e");
            tether = await ethers.getContractAt("IERC20Minimal", USDT_ADDR);
            usdc = await ethers.getContractAt("IERC20Minimal", USDC_ADDR);
            weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);
            wbtc = await ethers.getContractAt("IERC20Minimal", WBTC_ADDR);
        });
        describe("after a dai deposit", () => {
            const deposit = ethers.utils.parseEther("1");
            let signer1, addr1, currentDepositBalance;
            beforeEach(async () => {
                const path = encodePath([WETH_ADDR, DAI_ADDR], [3000]);
                signer1 = await ethers.provider.getSigner(0);
                addr1 = await signer1.getAddress();
                await getERC20(dai, [addr1], true);
                await dai.connect(depositorSigner).approve(contract.address, deposit);   
                try{
                    const tx = await contract.connect(depositorSigner).deposit(deposit, dai.address, path);
                    await tx.wait();
                    
                } catch(err){
                    console.log("Check your erc20 depositor account dai balance on the fork number");
                }                             
                currentDepositBalance = await dai.balanceOf(contract.address);
            });

            it("should not hold DAI", async function () {
                const balance = await dai.balanceOf(contract.address);
                assert.equal(Number(balance).toString(), "0");
            });
        
            it("should hold aDAI", async function () {
                const abalance = await aDai.balanceOf(contract.address);
                assert.equal(abalance.toString(), deposit.toString());
            }); 
            describe("On Withdraw", () => {
                let weth, dai, usdc, tether, wbtc;
                beforeEach(async () => {
                    dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);
                    aDai = await ethers.getContractAt("IERC20Minimal", "0x028171bCA77440897B824Ca71D1c56caC55b68A3");
                    aWETH = await ethers.getContractAt("IERC20", "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e");
                    tether = await ethers.getContractAt("IERC20Minimal", USDT_ADDR);
                    usdc = await ethers.getContractAt("IERC20Minimal", USDC_ADDR);
                    weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);
                    wbtc = await ethers.getContractAt("IERC20Minimal", WBTC_ADDR);

                });
                it("should revert if less than a month has passed", async () => {
                    let ex;
                    try {
                        await contract.connect(treasury).withdraw();
                    }
                    catch (_ex) {
                        ex = _ex;
                    }
                    assert(ex, "Attempted to withdraw when Not ready to withdraw. Expected transaction to revert!");
                });
        
                it("should withdraw if more than a month has passed", async () => {
                   
                    const thirtynDays = 30 * 24 * 60 * 60;
                    await hre.network.provider.request({
                        method: "evm_increaseTime",
                        params: [thirtynDays]
                    });
                    const ownerBalanceBefore = await dai.balanceOf(owner.getAddress());                    
                    const before = await dai.balanceOf(treasury.getAddress()); 
                    const approve = await contract.withdraw.call();
                   
                    const after = await dai.balanceOf(treasury.getAddress());
                    const ownerBalanceAfter = await dai.balanceOf(owner.getAddress());
                    const balance = await dai.balanceOf(contract.address);

                    assert.isTrue(after > before,"Withdraw didnt happened");
                    assert.isTrue(ownerBalanceBefore < ownerBalanceAfter,"Owner should have earned too");
                    assert.equal(balance, 0, "Funds are still on the contract");     
                    assert.isTrue(after > deposit,"Interest was not earned");  
                });
            });
        });

        describe("after a eth deposit",() => {
            const deposit = ethers.utils.parseEther("0.1");
            let signer1, addr1, currentDepositBalance = 0;
            beforeEach(async () => {
                const path = encodePath([WETH_ADDR, DAI_ADDR], [3000]);
                signer1 = await ethers.provider.getSigner(0);
                try{
                    const tx = await contract.connect(signer1).deposit(deposit, WETH_ADDR, path,{value: deposit});
                    const receipt = await tx.wait();
                }catch(err){
                    console.log('on eth deposit', err);
                }
            });

            it("should not have an ether balance", async function() {
                const balance = await ethers.provider.getBalance(contract.address);
                assert.equal(balance.toString(), "0");
              });
            
              it("should have aDai", async function() {
                const abalance = await aDai.balanceOf(contract.address);
                assert.equal(abalance.toString(), deposit.toString());
              });
        });
    });
});

describe("JulzPay eth preference", function() {
    let owner;
    let treasury;
    let monthly = true;
    const deposit = ethers.utils.parseEther("0.5");
    let withdrawToken = WETH_ADDR;
    beforeEach(async () => {
        owner = ethers.provider.getSigner(0);
        treasury = ethers.provider.getSigner(1);
        const JulzPay = await ethers.getContractFactory("JulzPay");
        contract = await JulzPay.deploy(owner.getAddress(), monthly, false, treasury.getAddress(), withdrawToken, WETH_ADDR, {value: deposit});
        await contract.deployed();
    });

    it("should not be funded initially if monthly is false", async function() {
        const balance = await ethers.provider.getBalance(contract.address);
        assert.equal(Number(balance.toString()), 0);
    });

    it("storage must be set initially", async function(){
        const token = await contract.withdrawToken()
        assert.equal(await contract.treasury(), await treasury.getAddress());
        assert.equal(await contract.monthly(), monthly);
        assert.equal(token.toString().toLowerCase(), withdrawToken.toString().toLowerCase());
    });


    describe("On Destruct", () => {
        it("should not revert if  owner calls", async () => {
            let ex;
            try {
                await contract.connect(owner).destruct();
            }
            catch (_ex) {
                ex = _ex;
            }
            assert.isUndefined(ex);
        });

        it("should revert if non owner calls", async () => {
            let ex;
            try {
                await contract.connect(treasury).destruct();
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "Attempted to destroy it!");
        });
    });

    describe("Fund Single Depositor", function () {
        let weth, dai, usdc, tether, wbtc;
        before(async () => {
            dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);
            aDai = await ethers.getContractAt("IERC20Minimal", "0x028171bCA77440897B824Ca71D1c56caC55b68A3");
            aWETH = await ethers.getContractAt("IERC20", "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e");
            tether = await ethers.getContractAt("IERC20Minimal", USDT_ADDR);
            usdc = await ethers.getContractAt("IERC20Minimal", USDC_ADDR);
            weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);
            wbtc = await ethers.getContractAt("IERC20Minimal", WBTC_ADDR);
        });
        describe("after a dai deposit", () => {
            const deposit = ethers.utils.parseEther("40");
            let signer1, addr1, currentDepositBalance;
            beforeEach(async () => {
                const path = encodePath([DAI_ADDR, WETH_ADDR], [3000]);
                signer1 = await ethers.provider.getSigner(0);
                addr1 = await signer1.getAddress();
                await getERC20(dai, [addr1], true);
                await dai.connect(depositorSigner).approve(contract.address, deposit);   
                try{
                    const tx = await contract.connect(depositorSigner).deposit(deposit, dai.address, path);
                    await tx.wait();
                    
                } catch(err){
                    console.log("Error:",err);
                }                             
                currentDepositBalance = await dai.balanceOf(contract.address);
                console.log('le deposite a ', contract.address);
            });

            it("should not hold DAI", async function () {
                const balance = await dai.balanceOf(contract.address);
                console.log('doubel check', contract.address);
                assert.equal(Number(balance).toString(), "0");
            });
        
            it("should hold aWeth", async function () {
                const abalance = await aWETH.balanceOf(contract.address);
                console.log('doubel check', contract.address);
                assert.equal(abalance.toString(), deposit.toString());
            }); 
          
        });

        describe("after a eth deposit",() => {
            const deposit = ethers.utils.parseEther("0.001");
            let signer1, addr1, currentDepositBalance = 0;
            beforeEach(async () => {
                const path = encodePath([DAI_ADDR, WETH_ADDR], [3000]);
                signer1 = await ethers.provider.getSigner(0);
                try{
                    const tx = await contract.connect(signer1).deposit(deposit, WETH_ADDR, path,{value: deposit});
                    const receipt = await tx.wait();
                }catch(err){
                    console.log('on eth deposit', err);
                }
            });

            it("should not have an ether balance", async function() {
                const balance = await ethers.provider.getBalance(contract.address);
                assert.equal(balance.toString(), "0");
              });
            
              it("should have aWeth", async function() {
                const abalance = await aWETH.balanceOf(contract.address);
                assert.equal(abalance.toString(), deposit.toString());
            });
            describe("On Withdraw", () => {
                let weth, dai, usdc, tether, wbtc;
                beforeEach(async () => {
                    dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);
                    aDai = await ethers.getContractAt("IERC20Minimal", "0x028171bCA77440897B824Ca71D1c56caC55b68A3");
                    aWETH = await ethers.getContractAt("IERC20", "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e");
                    tether = await ethers.getContractAt("IERC20Minimal", USDT_ADDR);
                    usdc = await ethers.getContractAt("IERC20Minimal", USDC_ADDR);
                    weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);
                    wbtc = await ethers.getContractAt("IERC20Minimal", WBTC_ADDR);

                });
                it("should revert if less than a month has passed", async () => {
                    let ex;
                    try {
                        await contract.connect(treasury).withdraw();
                    }
                    catch (_ex) {
                        ex = _ex;
                    }
                    assert(ex, "Attempted to withdraw when Not ready to withdraw. Expected transaction to revert!");
                });
        
                it("should withdraw if more than a month has passed", async () => {
                   
                    const thirtynDays = 30 * 24 * 60 * 60;
                    await hre.network.provider.request({
                        method: "evm_increaseTime",
                        params: [thirtynDays]
                    });
                    const before = await ethers.provider.getBalance(await treasury.getAddress());
                    const approve = await contract.withdraw.call();
                    const after = await ethers.provider.getBalance(await treasury.getAddress());
                    const balance = await ethers.provider.getBalance(contract.address);
                    
                    assert.equal(balance, 0, "Funds are still on the contract");  
                    assert.isTrue(after > deposit,"Interest was not earned"); 
                    assert.isAbove(after,before,"Withdraw didnt happened");
                });
            });
        });
    });
});