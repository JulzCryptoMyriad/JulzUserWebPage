const { assert } = require("chai");
const getERC20 = require("./getERC20");

const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const USDC_ADDR = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT_ADDR = "0xdac17f958d2ee523a2206206994597c13d831ec7";

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

describe("JulzPay", function() {
    let owner;
    let treasury;
    let monthly = false;
    const deposit = ethers.utils.parseEther("0");
    let withdrawToken = DAI_ADDR;
    beforeEach(async () => {
        owner = ethers.provider.getSigner(0);
        treasury = ethers.provider.getSigner(1);
        const JulzPay = await ethers.getContractFactory("JulzPay");
        contract = await JulzPay.deploy(owner.getAddress(), monthly, false, treasury.getAddress(), withdrawToken, WETH_ADDR, {value: deposit});
        await contract.deployed();
    });

    it("should be funded initially", async function() {
        const balance = await ethers.provider.getBalance(contract.address);
        assert.equal(balance.toString(), deposit);
    });

    it("storage must be set initially", async function(){
        const token = await contract.withdrawToken()
        assert.equal(await contract.treasury(), await treasury.getAddress());
        assert.equal(await contract.monthly(), monthly);
        assert.equal(token.toString().toLowerCase(), withdrawToken.toString().toLowerCase());
    });

    describe("On Withdraw", () => {
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

            const before = await ethers.provider.getBalance(treasury.getAddress());
            const approve = await contract.withdraw();
            const after = await ethers.provider.getBalance(treasury.getAddress());
            assert.equal(after.sub(before).toString(), deposit.toString());

            const balance = await ethers.provider.getBalance(contract.address);

            assert.equal(balance, 0);
            
        });
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
        let weth, dai, usdc, tether;
        before(async () => {
            dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);
            tether = await ethers.getContractAt("IERC20Minimal", USDT_ADDR);
            usdc = await ethers.getContractAt("IERC20Minimal", USDC_ADDR);
            weth = await ethers.getContractAt("IERC20Minimal", WETH_ADDR);
        });
        describe("after a dai deposit", () => {
            const deposit = ethers.utils.parseEther("100");
            let signer1, addr1, currentDepositBalance;
            before(async () => {
                signer1 = await ethers.provider.getSigner(0);
                addr1 = await signer1.getAddress();
                await getERC20(dai, [addr1], true);
                await dai.approve(contract.address, deposit);                
                await contract.deposit(deposit, dai.address);
                currentDepositBalance = await dai.balanceOf(contract.address);
            });

            it("should have increased the dai holdings", async () => {
                assert(currentDepositBalance.eq(deposit));
            });   

            it("shouldnt allow loose eth tx", async() =>{
                signer1 = await ethers.provider.getSigner(0);
                let ex;
                try {
                    const tx = signer1.sendTransaction({
                        to: contract.address,
                        value: ethers.utils.parseEther("1"),
                        gasLimit: 100000
                    });
                    await tx; 
                }
                catch (_ex) {
                    ex = _ex;
                }
                assert(ex, "Attempted to transfer eth!");
            });
        });

        describe("after a eth deposit",() => {
            const deposit = ethers.utils.parseEther("0.1");
            let signer1, addr1, currentDepositBalance=0;
            beforeEach(async () => {
                signer1 = await ethers.provider.getSigner(0);
                await contract.connect(signer1).deposit(deposit, WETH_ADDR,{value: ethers.utils.parseEther("0.1")});
                currentDepositBalance = await ethers.provider.getBalance(contract.address); 
            });

            it("should have increased the eth holdings", async () => {
                assert.equal(Number(currentDepositBalance),Number(deposit));
            });   

            it("it should be able to swap to expected token", async () => {
                const path = encodePath([WETH_ADDR, DAI_ADDR], [3000]);
                const before = await dai.balanceOf(contract.address);
                await contract.swap(WETH_ADDR, path);

                const daiBalance = await dai.balanceOf(contract.address);
                assert.isTrue(daiBalance > before);

            });
        });
    });
});
