import '../assets/css/App.css';
import {Carousel}  from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import  coin from'../assets/imgs/coins.jpg';
import  mocoins from'../assets/imgs/mocoins.jpg';
import  ethcoin from'../assets/imgs/ethcoin.jpg';

export default class Home extends Component {
    render(){
            return (
                <div className="App-container">
                    <Carousel className="Home">
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src={coin}
                            alt="First slide"
                            />
                            <Carousel.Caption className="carousel-description">
                            <h3>Join Today</h3>
                            <p>Allow your customers to pay using the crypto currency of their choosing while you only receive the tokens you feel comfortable with!.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                                <img
                                className="d-block w-100"
                                src={mocoins}
                                alt="Second slide"
                                />
                                <Carousel.Caption className="carousel-description">
                                <h3>Make your money work for you</h3>
                                <p>even after getting paid you have the chance to increase your revenue.</p>
                                </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                                <img
                                className="d-block w-100"
                                src={ethcoin}
                                alt="Third slide"
                                />

                                <Carousel.Caption className="carousel-description">
                                <h3>Be a part of the future</h3>
                                <p>Be in charge of your maximized finances.</p>
                                </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
        )
    }

}