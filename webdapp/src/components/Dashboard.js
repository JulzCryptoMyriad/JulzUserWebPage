import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import React, { PureComponent } from 'react';
import {ethers} from 'ethers';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
  } from 'recharts';
  

export default class SignIn extends PureComponent {

  async onWithdraw(e){
    e.preventDefault();
    //Get contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider;
    const contract = await new ethers.Contract(this.state.contract, this.state.abi, provider);

    //Connect to user
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    await signer;
    console.log('signer:', await signer.getAddress());

    //Call function
    const tx = await contract.connect(signer).withdraw();
    console.log('tx:',tx);
  }
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
                                <Card.Body>You have successfully withdrawn: {this.props.amount}</Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>You will be able to withdraw on: {this.props.daysLeft} day(s)
                                    <Button variant="success" className="Sign-item center" onClick={this.onWithdraw.bind(this)}>Withdraw</Button>
                                </Card.Body>                                
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="Sign-item">
                                <Card.Body>
                                    <ComposedChart
                                        width={500}
                                        height={400}
                                        data={this.props.txData}
                                        margin={{
                                            top: 20,
                                            right: 20,
                                            bottom: 20,
                                            left: 20,
                                        }}
                                        >
                                        <CartesianGrid stroke="#f5f5f5" />
                                        <XAxis dataKey="date" scale="band" />
                                        <YAxis  dataKey="amount"/>
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="amount" barSize={20} fill="#413ea0" />
                                        <Line type="monotone" dataKey="amount" stroke="#ff7300" />
                                     </ComposedChart>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Card className="Sign-item">
                          <Card.Body>
                            The code to include your widget inside your page is: 
                            <br/>
                            <code>{`<iframe src="http://localhost:3000/`+ this.props.userId +`/{USD_Amount to be charge}" ></iframe> `}</code>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                </Container>
            </div>
        )
    }

}