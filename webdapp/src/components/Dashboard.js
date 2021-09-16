import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import eth from '../assets/imgs/eth.png';
import dai from '../assets/imgs/dai.png';
import {Container, Row, Col, Card, Button, Spinner} from 'react-bootstrap';
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
    state = {
      showSpinner: false
    }

    async onWithdraw(e){
      e.preventDefault();
      this.setState({showSpinner: true});
      //Get contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider;

      const contract = await new ethers.Contract(this.props.contract, this.props.abi, provider);
      //Connect to user
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      await signer;
      console.log('signer:', await signer.getAddress());

      //Call function
      try{
        const tx = await contract.connect(signer).withdraw(ethers.utils.parseEther(this.props.total.total));
        console.log('tx:',tx);
      }catch(err){
        console.log(err);
        this.setState({showSpinner: false});
      }


      //fetch /withdraw to save tx
      contract.on('Withdraw', async (withdrawn) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( {id: this.props.userId, amount: ethers.utils.formatEther(withdrawn)})
        }

        const result = fetch("/withdraw", requestOptions)
        .then((data) => {return data.json()});
        await result;
        console.log('result', await result.data);
        this.setState({showSpinner: false});
        this.onRefresh();
      });
    }

    async onRefresh(){
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( {id: this.props.userId})
      };
      const result = await fetch("/refresh", requestOptions)
      .then(data => data.json());

      if(result.data.length > 0){        
        //get days left before next withdraw
        this.props.onRefresh(result.txsPending, result.data[0].withdrawn,result.data[0].nextWithdraw, result.total[0],result.data[0].restriction);   
      }  
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
                                <Card.Body>You have successfully withdrawn:<br/><img src={this.props.token === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"? eth:dai} alt="" height="40"/> {this.props.amount}</Card.Body>
                            </Card>
                        </Col>
                        <Col>
                          <Card>
                              <Card.Body>You have pending to withdraw (not including interests): {this.props.total.total}</Card.Body>
                          </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>{this.props.monthly? <p>You will be able to withdraw on {this.props.daysLeft} day(s)</p>:<p></p>}
                                {this.state.showSpinner?                                    
                                    <Spinner animation="border" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                    : <Button variant="success" className="Sign-item center" onClick={this.onWithdraw.bind(this)}>Withdraw</Button>}                                 
                                </Card.Body>                                
                            </Card>
                        </Col>
                    </Row>                    
                    <Row>
                        <Col>
                            <Card className="Sign-item">
                              <br/>
                              <Card.Title style={{paddingLeft: 25}}>Deposits Pending To Withdraw<br/> </Card.Title>
                                <Card.Body className="hor-flex">                                    
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
                                     <Button variant="outline-success" onClick={this.onRefresh.bind(this)}>Refresh</Button>
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
                            <br/><br/>To read the response transaction hash make sure to include in your script the following listener:<br/>
                            <code>{`<script type="text/javascript">
                                    window.addEventListener("message", (event) => {
                                      // Logic after collecting payment
                                    }, false);
                                  </script>`}</code>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                </Container>
            </div>
        )
    }

}