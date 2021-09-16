import '../assets/css/App.css';
import ame from  '../assets/imgs/aboutme.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import { Card, ListGroupItem, ListGroup } from 'react-bootstrap';

export default class Docs extends Component {
    render(){
            return (
            <div className="App-container">
                <Card style={{ width: '80%' }}>
                    <Card.Img variant="top" src={ame} />
                    <Card.Body>
                        <Card.Title><b>About Me(Julissa Dantes)</b></Card.Title>
                        <Card.Subtitle>For Now</Card.Subtitle>
                        <Card.Text>
                        <br/><br/>
                        I'm really passionate about building solutions where I see a problem. <br/><br/> 
                        This is an open source project so feel free to contribute following the guidelines on each repo!                     
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem><b>Mission</b>: Bring web3 closer to web2 developers, and offer opportunities for businesses to compound their earnings.<br/><br/></ListGroupItem>
                        <ListGroupItem><b>Vision</b>: Be the go to for easy crypto payments.<br/><br/></ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        <Card.Link href="https://twitter.com/JulissaDC">Twitter</Card.Link>
                        <Card.Link href="https://www.linkedin.com/in/julissa-dantes-castillo/">Linkedin</Card.Link>
                        <Card.Link href="https://github.com/JulzCryptoMyriad">Github</Card.Link>
                    </Card.Body>
                </Card>
            </div>
        )
    }

}