import '../assets/css/App.css';
import {Form, FloatingLabel, Row, Col, Button, Alert, Placeholder} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class SignUp extends Component {
    state = {
        email : "",
        password : "",
        token: "",
        treasury: "",
        checked: 0,
        contractAddress: ""

      };
    
      onSubmit = async (e) => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {email: this.state.email, password: this.state.password, withdrawTokenAddress: this.state.token, treasury: this.state.treasury, checked: this.state.checked, contractAddress: this.state.contractAddress })
        };

        const result = fetch("/create", requestOptions)
        .then(async (res) => await res.json())
        .then((data) =>  console.log('res',data));
        await result
        if(result){
            console.log('not login');
            this.setState({ show: true })
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        }else{
            this.props.onLog();
            this.props.history.push('/Dashboard');
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
                        <option value="0xdf032bc4b9dc2782bb09352007d4c57b75160b15">ETH</option>
                        <option value="0x6f5390a8cd02d83b23c5f1d594bffb9050eb4ca3">DAI</option>
                        <option value="0x7338fe8001a27b63ecdfe4e7a8b226475022edae">USDC</option>
                        <option value="0x5af59f281b3cfd0c12770e4633e6c16dd08ea543">WBTC</option>
                        <option value="0x1a37dd375096820a5fde14342720102c07100f26">USDT</option>
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
                    <Button type="submit"  onClick={this.onSubmit} className="center">Sign up</Button>
                    </Col>
                </Form.Group>
                </Form>
                <Placeholder xs={12} size="xs" />
                <p className="center">Already a memeber? <Link to="/SignIn">Sign In</Link></p>
            </div>
        )
    }

}