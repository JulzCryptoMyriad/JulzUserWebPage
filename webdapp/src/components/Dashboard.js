import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Card, Button,ListGroup} from 'react-bootstrap';
import React, { Component } from 'react'

export default class SignIn extends Component {
    render(){
            return (
            <div className="App-container">
                <h2>Welcome Back!</h2>
                <h6>We are so happy to see you</h6>
                <br/>
                <Container>
                    <Row>
                        <Col>                        
                            <Card>
                                <Card.Body>You have successfully withdrawn: 0.00</Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>You will be able to withdraw on: 1 day 2 minutes and 53 secons
                                    <Button variant="success" className="Sign-item center">Withdraw</Button>
                                </Card.Body>                                
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

}