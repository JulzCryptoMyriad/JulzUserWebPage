import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, FloatingLabel, Row, Col, Button, Alert} from 'react-bootstrap';
import React, { Component } from 'react'

export default class SignIn extends Component {
    render(){
            return (
            <div className="App-container">
                <Form>
                    <Form.Group className="mb-3 Sign-item" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit" href="/Dashboard">
                        Log In
                    </Button>
                </Form>
            </div>
        )
    }

}