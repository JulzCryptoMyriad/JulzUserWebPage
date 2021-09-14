import '../assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Header from "../components/Header.js";
import Home from "../components/Home.js";
import SignUp from "../components/SignUp.js";
import SignIn from "../components/SignIn.js";
import Docs from "../components/Docs.js";
import About from "../components/About.js";
import Dashboard from "../components/Dashboard.js";

class App extends Component{
  state = {
    logged : false,
    userId : "",
    constract: {},
    abi:{},
    txData: []
  }

  onLog = (id, contract, abi, data) => {
    this.setState({ logged: true })
    this.setState({ userId : id})
    this.setState({ contract : contract})
    this.setState({ abi : abi})
    this.setState({ txData : data})
    console.log('data', this.state.txData)
  }

  render(){
    return (
      <div className="App">
       <Header {...this.state}/>
       <BrowserRouter>
        <Switch>
          <Route exact  path="/" component={Home} />
          <Route path="/SignUp" render={() => <SignUp onLog ={this.onLog}/>}/>   
          <Route path="/SignIn" render={() => <SignIn onLog ={this.onLog}/>}/>
          <Route path="/Docs" component={Docs} />
          <Route path="/About" component={About} />
          <Route path="/SignOut" component={Home} />
          {this.state.logged? <Route path="/Dashboard" render={() => <Dashboard {...this.state}/>} />: <Route path="/Dashboard" component={Home}/>}
        </Switch>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
