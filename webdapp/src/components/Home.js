import '../assets/css/App.css';
import {Carousel}  from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'

export default class Home extends Component {
    render(){
            return (
                <div className="App-container">
                    <Carousel>
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src="../assets/imgs/coins.jpg"
                            alt="First slide"
                            />
                            <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                                <img
                                className="d-block w-100"
                                src="../assets/imgs/mocoins.jpg"
                                alt="Second slide"
                                />

                                <Carousel.Caption>
                                <h3>Second slide label</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                                <img
                                className="d-block w-100"
                                src="../assets/imgs/ethcoin.jpg"
                                alt="Third slide"
                                />

                                <Carousel.Caption>
                                <h3>Third slide label</h3>
                                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                                </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
        )
    }

}