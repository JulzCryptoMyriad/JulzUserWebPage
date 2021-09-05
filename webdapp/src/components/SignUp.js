import '../assets/css/App.css';
import {Form, FloatingLabel, Row, Col, Button, Alert} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'

export default class SignUp extends Component {
    state = {
        email : "",
        password : "",
        token: "",
        treasury: "",
        checked: 0,
        contractAddress: ""

      };
    
      onSubmit = async () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {email: this.state.email, password: this.state.password, token: this.state.token, treasury: this.state.treasury, checked: this.state.checked, contractAddress: this.state.contractAddress})
        };

        fetch("/create", requestOptions)
        .then(async (res) => await res.json())
        .then((data) =>  console.log('res',data));
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
                <FloatingLabel className="Sign-item" controlId="floatingSelectGrid" label="Select Token you are willing accept as payment forms">
                    <Form.Select onChange={e => this.setState({ token: e.target.value })} aria-label="Floating label select example">
                        <option value="0">Choose...</option>
                        <option value="ETH">ETH</option>
                        <option value="DAI">DAI</option>
                        <option value="USDC">USDC</option>
                    </Form.Select>
                </FloatingLabel>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check onChange={e => this.setState({ checked: (e.target.value)? 1 : 0 })} type="checkbox" label="Withdraw once a month" />
                </Form.Group>
                <Alert variant="warning">
                    *Why do i want to withdraw once a month? By Using the JulzPay Button on your page you have the chance to win a credit bonus as we increase the value of your coins for you, also you migth want the market to reach a certain cap before withdrawing. If you check this checkbox the user creation will be free, if you do not check this option the creation of your user will cost 0.5 ETH.
                </Alert>
                <Form.Group as={Row} className="mb-3 Sign-item">
                    <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit"  onClick={this.onSubmit}>Sign up</Button>
                    </Col>
                </Form.Group>
                </Form>
            </div>
        )
    }

}