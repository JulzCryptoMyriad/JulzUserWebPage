import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Nav, Container}  from 'react-bootstrap';
import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'

export default class Header extends Component {

    render(){
            return (
                <div className="App">
                    <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand className="Brand" href="/">Julz</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/Docs">Docs</Nav.Link>                                                     
                            <Nav.Link href="/About">About Us</Nav.Link>  
                        </Nav>       
                        {!this.props.logged ? <Nav.Link href="/SignUp" className="justify-content-end" >Sign Up</Nav.Link>  : ''}                                                                    
                        {!this.props.logged ? <Nav.Link href="/SignIn" className="justify-content-end" >Sign In</Nav.Link>   : ''}                                                                   
                        {this.props.logged ? <Nav.Link href="/SignOut" className="justify-content-end" visible={this.props.logged ? 0 : 1}>Sign Out</Nav.Link> :''}
                        </Navbar.Collapse>
                    </Container>
                    </Navbar>
                </div>
        )
    }

}