const { assert } = require("chai");
const getERC20 = require("./getERC20");

const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const UNI_ADDR = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";
const USDT_ADDR = "0xdac17f958d2ee523a2206206994597c13d831ec7";
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
        let fund, dai, uni, tether;
        before(async () => {
            dai = await ethers.getContractAt("IERC20Minimal", DAI_ADDR);
            tether = await ethers.getContractAt("IERC20Minimal", USDT_ADDR);
        });
        describe("after a dai deposit", () => {
            const deposit = ethers.utils.parseEther("100");
            let signer1, addr1, currentDepositBalance;
            before(async () => {
                signer1 = await ethers.provider.getSigner(0);
                addr1 = await signer1.getAddress();
                await getERC20(dai, [addr1]);
                await dai.approve(contract.address, deposit);

                await contract.deposit(deposit, dai.address);
                currentDepositBalance = await dai.balanceOf(contract.address);
            });

            it("should have increased the dai holdings", async () => {
                assert(currentDepositBalance.eq(deposit));
            });           
        });

        describe("after an eth deposit", () => {
            const deposit = ethers.utils.parseEther("1");
            let signer1, balance, currentBalance, ethBalance;
            before(async () => {
                balance = await ethers.provider.getBalance(contract.address);
                signer1 = await ethers.provider.getSigner(0);
                //pay eth
                //contract.sendTransaction({from: signer1, value: deposit});
                const tx = signer1.sendTransaction({
                    to: contract.address,
                    value: deposit,
                    gasLimit: 100000
                });
                await tx;
                ethBalance = await ethers.provider.getBalance(contract.address);
                currentBalance = await dai.balanceOf(contract.address);
                console.log('eth:',Number(ethBalance),'dai', Number(currentBalance));
            });

            it("Must swap to prefered token", async () => {
                assert.equal(Number(currentBalance), deposit);
            });           
        });
    });
});
