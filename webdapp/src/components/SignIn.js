import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,  Button, Overlay } from 'react-bootstrap';
import React, { Component } from 'react'
import { withRouter } from 'react-router';

 class SignIn extends Component {
    state = {
        email : "",
        password : "",
        show: false,
        target : {}
      };
      

      onSubmit = async (e) => {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {email: this.state.email, password: this.state.password})
        };

        const result = await fetch("/login", requestOptions)
        .then(data => data.json());

        console.log('fetch result', await result.data.length);
        if(result.data.length < 1){
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
                    <Button variant="primary" type="submit" onClick={this.onSubmit.bind(this)} ref={this.state.target}>
                        Log In
                    </Button>
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
                            Login Failed
                        </div>
                        )}
                    </Overlay>
                </Form>
            </div>
        )
    }

}

export default withRouter(SignIn);