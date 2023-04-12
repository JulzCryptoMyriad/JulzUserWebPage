//SPDX-License-Identifier: WTFPL
pragma solidity ^0.7.5;
pragma abicoder v2;
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/BytesLib.sol";
import '@uniswap/v3-core/contracts/libraries/TickMath.sol';
import "./ILendingPool.sol";
import "./IWETHGateway.sol";
import "hardhat/console.sol";

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract JulzPay {
      using BytesLib for bytes;
    event Paid(address sender, uint256 amountReceived, uint256 amountDeposited, address token);
    event Withdraw(uint);
    address private immutable WETH_ADD;
    address payable private owner;
    address public withdrawToken;
    bool public monthly;
    bool public covergas;//for later update
    uint256 public lastWithdrawDate;
    address public treasury;    
    bool private processing;
    ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    // the mainnet AAVE v2 lending pool
    ILendingPool pool = ILendingPool(0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9);
    //the mainnet AAVE v2 wethGateway
    IWETHGateway gateway = IWETHGateway(0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04);
    // aave interest bearing addresses on mainnet
    IERC20 aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3);
    IERC20 aUSDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    IERC20 aUSDT = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    IERC20 aWBTC = IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);
    IERC20 aWETH = IERC20(0x030bA81f1c18d280636F32af80b9AAd02Cf0854e);

    constructor(address payable _owner,
    bool _monthly,
    bool _covergas,
    address _treasury,
    address _withdrawToken,
    address _WETH_ADD) payable {
        require((!_monthly && msg.value == 0) || (_monthly && msg.value > 0), "If montly should have a deposit");
        owner = _owner;
        monthly = _monthly;
        covergas = _covergas;
        withdrawToken =  _withdrawToken;
        lastWithdrawDate = block.timestamp;
        treasury = _treasury;
        WETH_ADD = _WETH_ADD;
    }

    function deposit(uint _amount, address _token, bytes memory path) external payable{
        uint256 sdeposit;
        if(!(WETH_ADD == _token)){
            IERC20 depositor =  IERC20(_token);            
            depositor.transferFrom(msg.sender, address(this), _amount);
        }

        // UNISWAP
        if (!(withdrawToken == _token)) {
            sdeposit = swap(_token, path, _amount);
        } else {
            sdeposit = _amount;
        }

        // AAVE
        //Only enter if preferred token is eth and deposited token was eth
        if(withdrawToken == WETH_ADD && sdeposit == _amount){
            _amount = msg.value;
            gateway.depositETH{ value: address(this).balance }(address(pool), address(this), 0);
        } else {   
            IERC20 erc20 =  IERC20(withdrawToken);      
            erc20.approve(address(pool), erc20.balanceOf(address(this)));
            pool.deposit(withdrawToken, erc20.balanceOf(address(this)), address(this), 0);  
        }
        emit Paid( msg.sender, _amount, sdeposit, _token);
    }

    function swap(address _token, bytes memory path, uint amount) internal returns(uint256 result) {

        IERC20 erc20 =  IERC20(_token);
        erc20.approve(address(router), amount);
        

        ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path, address(this), block.timestamp,  amount, 0
        );

        // This can process ETH swaps as well so it should send the amount as value but if we are working with ERC20 tokens this doesnt apply
        if(address(this).balance < amount) {
            amount = 0;
        }

        result = router.exactInput{ value:amount }(params);
    }

    //TBD originalDeposits should not be a parameter should be computed at deposit
    function withdraw(uint originalDeposits) external {//TBD access control here to avoid a random stranger to withdraw the owners rewards
        require(lastWithdrawDate + 30 days <= block.timestamp || monthly == false, "Not ready to withdraw");  
        require(processing == false, "Already processing");
        processing = true;  //avoids reentrancy
        uint withdrawn;
        if(withdrawToken == WETH_ADD){ 
            uint interest =  aWETH.balanceOf(address(this)) - originalDeposits;  
            uint balance =  originalDeposits + ((interest/10)*7);//70% of interest
            // Withraw from AAVE
            aWETH.approve(address(gateway), aWETH.balanceOf(address(this)));
            gateway.withdrawETH(address(pool), aWETH.balanceOf(address(this)), address(this));
            // tranfers
            payable(treasury).transfer(balance);
            payable(owner).transfer(address(this).balance);
            withdrawn = balance;
        } else {
            IERC20 aTOKEN = GetAToken();
            uint interest =  aTOKEN.balanceOf(address(this)) - originalDeposits;  
            uint amount =  originalDeposits + ((interest/10)*7);//70% of interest
            withdrawn = amount;
           // Withraw from AAVE
            if (amount >  aTOKEN.balanceOf(address(this))){//if there were some lost on the protocol
                pool.withdraw(address(withdrawToken), aTOKEN.balanceOf(address(this)), treasury);   
            } else {
                pool.withdraw(address(withdrawToken), amount, treasury);         
                pool.withdraw(address(withdrawToken), aTOKEN.balanceOf(address(this)), owner);
            }
        }         

        lastWithdrawDate = block.timestamp;        
        processing = false;
        emit Withdraw(withdrawn);
    }

    receive() external payable {}// TBD is there a risk of locking eth inside the contract?

    function destruct() public {
        require(msg.sender == owner, "Not the owner");
        selfdestruct(owner);
    }

    function GetAToken() internal view returns(IERC20 _token) {
        if(withdrawToken == address(0x6B175474E89094C44Da98b954EedeAC495271d0F)){
            _token = aDai;
        }

        if(withdrawToken == address(0xdAC17F958D2ee523a2206206994597C13D831ec7)){
            _token = aUSDT;
        }
        
        if(withdrawToken == address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)){
            _token = aUSDC;
        }
        
        if(withdrawToken == address(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599)){
            _token = aWBTC;
        }
    }
}