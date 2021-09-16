import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Header from "../components/Header.js";
import Home from "../components/Home.js";
import SignUp from "../components/SignUp.js";
import SignIn from "../components/SignIn.js";
import brain from '../assets/imgs/brain.png';
import Docs from "../components/Docs.js";
import About from "../components/About.js";
import Dashboard from "../components/Dashboard.js";

class App extends Component{
  state = {
    logged : false,
    userId : "",
    constract: {},
    abi:{},
    txData: [],
    amount: 0,//withdrawn amount
    daysLeft : 30,
    total: 0,//inside the contract
    monthly: true,//if restriction about withdraw
    token: ""
  }

  onLog = (id, contract, abi, data, amount, daysLeft, total, monthly, token) => {
    this.setState({ logged: true })
    this.setState({ userId : id})
    this.setState({ contract : contract})
    this.setState({ abi : abi})
    this.setState({ txData : data})
    this.setState({ amount : amount})
    this.setState({ daysLeft : daysLeft})
    this.setState({ monthly : monthly})
    this.setState({ total : total[0]})
    this.setState({ token : token})
  }

  onRefresh = (data, amount, daysLeft, total, monthly) => {
    this.setState({ txData : data})
    this.setState({ amount : amount})
    this.setState({ daysLeft : daysLeft})
    this.setState({ total : total})
    this.setState({ monthly : monthly})
  }

  render(){
    return (
      <div>
        <div className="App">
        <Header {...this.state}/>
        <BrowserRouter>
          <Switch>
            <Route exact  path="/" component={Home} />
            <Route path="/SignUp" render={() => <SignUp onLog ={this.onLog}/>}/>   
            <Route path="/SignIn" render={() => <SignIn onLog ={this.onLog}/>}/>
            <Route path="/Docs" component={Docs} />
            <Route path="/About" component={About} />
            <Route path="/SignOut" render={() => <SignIn onLog ={this.onLog}/>}/>
            {this.state.logged? <Route path="/Dashboard" render={() => <Dashboard {...this.state} onRefresh={this.onRefresh.bind(this)}/>} />: <Route path="/Dashboard" component={Home}/>}
          </Switch>
        </BrowserRouter>
        </div>
        <div>
          <footer className="footer--pin">
                  Powered by Julissa's Brain<img src={brain} alt="Brain" height="40"/>
              </footer>
        </div>
      </div>
    );
  }
}

export default App;
