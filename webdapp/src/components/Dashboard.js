import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import React, { PureComponent } from 'react'
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
  
  const data = [
    {
      date: 'Page A',
      amount: 590,
    },
    {
      date: 'Page B',
      amount: 868,
    },
    {
      date: 'Page C',
      amount: 1397,
    },
    {
      date: 'Page D',
      amount: 1480,
    },
    {
      date: 'Page E',
      amount: 1520,
    },
    {
      date: 'Page F',
      amount: 1400,
    },
  ];

export default class SignIn extends PureComponent {

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
                    <Row>
                        <Col>
                            <Card className="Sign-item">
                                <Card.Body>
                                    <ComposedChart
                                        width={500}
                                        height={400}
                                        data={data}
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
                            <code>{`<iframe src="http://localhost:3000/`+ this.props.userId +`" ></iframe> `}</code>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                </Container>
            </div>
        )
    }

}