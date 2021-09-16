import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import {Accordion, ListGroup} from 'react-bootstrap';

export default class Docs extends Component {
    render(){
            return (
            <div className="App-container">
                <Accordion defaultActiveKey="0" flush>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Product Documentation</Accordion.Header>
                        <Accordion.Body>
                            <b>How to start accepting crypto on your web page?</b><br/><br/>
                            Go to the Sign Up page, fill up the info and a contract will be deployed to handle all your transactions for you.
                             On your Dashboard you'll find the code to embed the widget inside your app and as easy as that, you are already collecting crypto as payment.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Developers Documenation</Accordion.Header>
                        <Accordion.Body>
                        On the <a href="https://github.com/JulzCryptoMyriad">organization repo</a> you'll find 3 repositories:<br/><br/>
                        <ListGroup>
                            <ListGroup.Item><a href="https://github.com/JulzCryptoMyriad/JulzUserWebPage">Users Web App</a><br/>The code for the user management page. Hold the contract and the information about the transactions made by the widget</ListGroup.Item>
                            <ListGroup.Item><a href="https://github.com/JulzCryptoMyriad/JulzWidget">Widget</a><br/>The code for the widget that's supposed to be embedded inside your page</ListGroup.Item>
                            <ListGroup.Item><a href="https://github.com/JulzCryptoMyriad/JulzDemoClientSite">Demo</a><br/>An example of how to integrate the widget to any web page</ListGroup.Item>
                        </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        )
    }

}