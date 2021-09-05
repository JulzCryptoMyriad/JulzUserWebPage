import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,  Button} from 'react-bootstrap';
import React, { Component } from 'react'

export default class SignIn extends Component {
    state = {
        email : "",
        password : ""
      };
    
      onSubmit = async () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {email: this.state.email, password: this.state.password})
        };

        fetch("/login", requestOptions)
        .then(async (res) => await res.json())
        .then((data) =>  console.log('res',data));
      };

    render(){
            return (
            <div className="App-container">
                <Form>
                    <Form.Group className="mb-3 Sign-item" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control  onChange={e => this.setState({ email: e.target.value })} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control  onChange={e => this.setState({ password: e.target.value })} type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit" href="/Dashboard" onClick={this.onSubmit}>
                        Log In
                    </Button>
                </Form>
            </div>
        )
    }

}