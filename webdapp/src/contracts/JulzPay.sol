//SPDX-License-Identifier: WTFPL
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/BytesLib.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
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

contract JulzPay{
    address private WETH_ADD;
    address payable private owner;
    address public withdrawToken;
    bool public monthly;
    bool public covergas;//for later update
    uint256 public lastWithdrawDate;
    address public treasury;    
    bool private processing;
    IUniswapV2Router01 uniswapRouter2 = IUniswapV2Router01(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
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
    address _WETH_ADD) payable{
        require(_monthly || (!_monthly && msg.value > 0),"Not funded correctly");
        owner = _owner;
        monthly = _monthly;
        covergas = _covergas;
        withdrawToken =  _withdrawToken;
        lastWithdrawDate = block.timestamp;
        treasury = _treasury;
        WETH_ADD = _WETH_ADD;
        if(msg.value > 0){
            owner.transfer(address(this).balance);
        }
    }
    event Withdraw(uint);
    function withdraw(uint originalDeposits) external{
        require(lastWithdrawDate + 30 days <= block.timestamp || monthly == false, "Not ready to withdraw");  
        require(processing == false,"Already processing");
        processing = true;  //avoids reentrancy
        uint withdrawn;
        if(withdrawToken == WETH_ADD){ 
            uint interest =  aWETH.balanceOf(address(this)) - originalDeposits;  
            uint balance =  originalDeposits + ((interest/10)*7);//70% of interest
            aWETH.approve(address(gateway), aWETH.balanceOf(address(this)));
            gateway.withdrawETH(address(pool), aWETH.balanceOf(address(this)), address(this));
            //tranfers
            payable(treasury).transfer(balance);
            payable(owner).transfer(address(this).balance);
            withdrawn = balance;
        }else{
            IERC20 aTOKEN = GetAToken();
            uint interest =  aTOKEN.balanceOf(address(this)) - originalDeposits;  
            uint amount =  originalDeposits + ((interest/10)*7);//70% of interest
            withdrawn = amount;
           //aave + tranfers
            if(amount >  aTOKEN.balanceOf(address(this))){//if there were some lost on the protocol
                pool.withdraw(address(withdrawToken), aTOKEN.balanceOf(address(this)), treasury);   
            }else{
                pool.withdraw(address(withdrawToken), amount, treasury);         
                pool.withdraw(address(withdrawToken), aTOKEN.balanceOf(address(this)), owner);
            }
        }         

        lastWithdrawDate = block.timestamp;        
        processing = false;
        emit Withdraw(withdrawn);
    }

    event Paid(address sender, uint256 amountReceived, uint256 amountDeposited, address token);

    function deposit(uint _amount, address _token, bytes memory path) external payable{
        uint256 sdeposit;
        if(!(WETH_ADD == _token)){
            IERC20 depositor =  IERC20(_token);            
            depositor.transferFrom(msg.sender, address(this), _amount);
        }

        if(!(withdrawToken == _token)){
            IERC20 depositor =  IERC20(_token);    
            console.log('about to swap', address(this).balance, _amount, depositor.balanceOf(address(this)));
            sdeposit = swap(_token, path, _amount);
            console.log('Swap deposited:', sdeposit);
        }else{
            sdeposit = _amount;
        }

        if(withdrawToken == WETH_ADD){
            _amount = msg.value;
            gateway.depositETH{value: address(this).balance}(address(pool), address(this), 0);
        }else{       
            IERC20 erc20 =  IERC20(withdrawToken);      
            erc20.approve(address(pool), _amount);
            pool.deposit(withdrawToken, _amount, address(this), 0);  
        }
        emit Paid( msg.sender, _amount, sdeposit, _token);
    }

    function swap(address _token, bytes memory path, uint amount) public returns(uint256 result){

        IERC20 erc20 =  IERC20(_token);
        if(!(_token == WETH_ADD)){
            console.log('i approve',_token);
            bool success = erc20.approve(address(router), amount);
            require(success, "failed approve from this to uniswapaddress");
        }else{
            erc20.approve(address(uniswapRouter2), amount);
        }

        if(WETH_ADD != withdrawToken){
            //token -->Token
                ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
                    path, address(this), block.timestamp,  amount, 0
                );

                result = router.exactInput{ value:amount }(params);
        }else{
            //token --> eth
            address[] memory _path = new address[](2);
            _path[0] = _token;
            _path[1] = WETH_ADD;
             IERC20 nerc20 =  IERC20(WETH_ADD);
             nerc20.approve(address(uniswapRouter2), amount);
            uint amountRequired  = uniswapRouter2.getAmountsIn(amount, _path)[0];
            console.log('did i survive',amountRequired);
            uint[] memory amounts = uniswapRouter2.swapTokensForExactETH(amountRequired-1, amount, _path, address(this), block.timestamp);
        }

    }

    receive() external payable {
        console.log('val', msg.value);
    }

    function destruct() public {
        require(msg.sender == owner, "Not the owner");
        selfdestruct(owner);
    }

    function GetAToken() internal view returns(IERC20){
        if(withdrawToken == address(0x6B175474E89094C44Da98b954EedeAC495271d0F)){
            return aDai;
        }
        if(withdrawToken == address(0xdAC17F958D2ee523a2206206994597C13D831ec7)){
            return aUSDT;
        }
        if(withdrawToken == address(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)){
            return aUSDC;
        }
        if(withdrawToken == address(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599)){
            return aWBTC;
        }
    }

}