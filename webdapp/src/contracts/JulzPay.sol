//SPDX-License-Identifier: WTFPL
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/BytesLib.sol";
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
    //enum TokenSymbol {ETH, USDC, DAI, WBTC, USDT}//Eth, Usdc, Dai wrapped bitcoin, Thether
    address private WETH_ADD;
    address payable private owner;
    address public withdrawToken;//Symbol => accepted/not accepted
    bool public monthly;
    bool public covergas;//for later update
    uint256 public lastWithdrawDate;
    address public treasury;
    bool private processing;
    ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    constructor(address payable _owner,
    bool _monthly,
    bool _covergas,
    address _treasury,
    address _withdrawToken,
    address _WETH_ADD) payable{
        owner = _owner;
        monthly = _monthly;
        covergas = _covergas;
        withdrawToken =  _withdrawToken;
        lastWithdrawDate = block.timestamp;
        treasury = _treasury;
        //todo transfer payment to owner thats for users that wont compound
        WETH_ADD = _WETH_ADD;
    }

    function withdraw() external{
        require(lastWithdrawDate + 30 days <= block.timestamp, "Not ready to withdraw");  
        require(processing == false);

        processing = true;            

        payable(treasury).transfer(address(this).balance);
        lastWithdrawDate = block.timestamp;
        
        processing = false;
    }

    event Paid(address sender, uint256 amountReceived, uint256 amountDeposited, address token);
    //for erc20 payments
    function deposit(uint _amount, address _token) external {
        IERC20 erc20 =  IERC20(_token);
        // pulling cryptocurrency from the person calling this contract 
        erc20.transferFrom(
                msg.sender,
                address(this),
                _amount
        ) ;

        uint256 total = _amount;
        if(_token != withdrawToken){
            
             total = swap(erc20, _token, _amount);
        }
        emit Paid( msg.sender, _amount, total, _token);
    }

    //for eth payments
    receive() external payable{
        IERC20 erc20 =  IERC20(WETH_ADD);
        uint256 total;
        if(!(WETH_ADD == withdrawToken)){
            total = swap(erc20, WETH_ADD, msg.value);
        }

        emit Paid( msg.sender, msg.value, total, address(this));
    }

    function swap(IERC20 erc20, address originalToken, uint amount) internal returns(uint256 result){
        erc20.approve(address(router), amount);
        bytes memory path = abi.encodePacked(originalToken, uint24(3),withdrawToken);

       ISwapRouter.ExactInputParams memory params = ISwapRouter.ExactInputParams(
            path, address(this), block.timestamp, amount, 0
        );
        result = router.exactInput(params);
    }

    function destruct() public {
        require(msg.sender == owner, "Not the owner");
        selfdestruct(owner);
    }

}