import '../assets/css/App.css';
import {Form, FloatingLabel, Row, Col, Button, Alert, Placeholder, Overlay} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {deploy} from '../services/deploy';
import {ethers} from 'ethers';
import { withRouter } from 'react-router';

class SignUp extends Component {
    state = {
        email : "",
        password : "",
        token: "",
        treasury: "",
        checked: 0,
        contractAddress: "",
        show: false,
        target : {}
      };
    
      async onSubmit(e) {
        e.preventDefault()
        
        //USER CREATION
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {email: this.state.email, password: this.state.password, withdrawTokenAddress: this.state.token, treasury: this.state.treasury, checked: this.state.checked, contractAddress: this.state.contractAddress })
        };
        let userid;
        const result = await fetch("/create", requestOptions)
        .then(async (res) => await res.json())
        .then((data) =>  {
            console.log('res',data);
            if(data){
                userid = data.id;  
            }
        });

        if(userid){
            //CONTRACT DEPLOYMENT
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = provider.getSigner();
            await signer;
            console.log('signer:',await signer.getAddress());
            const charge = (!this.state.checked)? "0.5":"0";
            const contract = await deploy({ checked: this.state.checked,treasury: this.state.treasury, withdrawTokenAddress: this.state.token},charge, signer);
            //UPDATE USER registry
                     
            const upRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {id: userid, address: contract.address})
            };
            console.log('id',userid, 'data', upRequestOptions.body,'result', result);
            const update = fetch("/update", upRequestOptions)
            .then(async (res) => await res.json())
            .then((data) =>  console.log('res', data));
            await update;
            //REDIRECTING
            this.props.onLog(userid,contract.address,contract.abi,[],0,30,[{total:0}],this.state.checked,this.state.token);
            this.props.history.push('/Dashboard');
        }else{
            
            this.setState({ show: true })
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        } 
      };

    render(){
            return (
            <div className="App-container">
                Please fill this form to be a part of the future of payments:
                <Form>
                <Form.Floating className="mb-3 Sign-item">
                    <Form.Control
                    id="floatingInputCustom"
                    type="email"
                    placeholder="name@example.com"
                    onChange={e => this.setState({ email: e.target.value })}
                    />
                    <label htmlFor="floatingInputCustom">Email address</label>
                </Form.Floating>
                <Form.Floating > 
                    <Form.Control className="Sign-item"
                    id="floatingPasswordCustom"
                    type="password"
                    placeholder="Password"
                    onChange={e => this.setState({ password: e.target.value })}
                    />
                    <label htmlFor="floatingPasswordCustom">Password</label>
                </Form.Floating>
                <Form.Floating className="mb-3 Sign-item">
                    <Form.Control
                    id="floatingInputCustom2"
                    type="text"
                    placeholder="0x..."
                    onChange={e => this.setState({ treasury: e.target.value })}
                    />
                    <label htmlFor="floatingInputCustom2">Treasury Address</label>
                </Form.Floating>
                <FloatingLabel className="Sign-item" controlId="floatingSelectGrid" label="Select token you want to withdraw as">
                    <Form.Select onChange={e => this.setState({ token: e.target.value })} aria-label="Floating label select example">
                        <option value="0">Choose...</option>
                        <option value="0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">ETH</option>
                        <option value="0x6b175474e89094c44da98b954eedeac495271d0f">DAI</option>
                        <option value="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48">USDC</option>
                        <option value="0x2260fac5e5542a773aa44fbcfedf7c193bc2c599">WBTC</option>
                        <option value="0xdac17f958d2ee523a2206206994597c13d831ec7">USDT</option>
                    </Form.Select>
                </FloatingLabel>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check onChange={e => this.setState({ checked: (e.target.value)? 1 : 0 })} type="checkbox" label="Withdraw once a month" />
                </Form.Group>
                <Alert variant="warning">
                    *Why do i want to withdraw once a month? By Using the JulzPay Button on your page you have the chance to win a credit bonus as we increase the value of your coins for you, also you might want the market to reach a certain cap before withdrawing. If you check this checkbox the user creation will be free, if you do not check this option the creation of your user will cost 0.5 ETH.
                </Alert>
                <Form.Group as={Row} className="mb-3 Sign-item">
                    <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit"  onClick={this.onSubmit.bind(this)} className="center" ref={this.state.target}>Sign up</Button>
                    <Overlay target={this.state.target.current} show={this.state.show} placement="right">
                        {({ placement, arrowProps, show: _show, popper, ...props }) => (
                        <div
                            {...props}
                            style={{
                            backgroundColor: 'rgba(255, 100, 100, 0.85)',
                            padding: '2px 10px',
                            color: 'white',
                            borderRadius: 3,
                            ...props.style,
                            }}
                        >
                            Sign Up Failed
                        </div>
                        )}
                    </Overlay>
                    </Col>
                </Form.Group>
                </Form>
                <Placeholder xs={12} size="xs" />
                <p className="center">Already a member? <Link to="/SignIn">Sign In</Link></p>
            </div>
        )
    }

}
export default withRouter(SignUp);