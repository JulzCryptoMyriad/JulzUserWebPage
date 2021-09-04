import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Header from "./components/Header.js";
import Home from "./components/Home.js";
import SignUp from "./components/SignUp.js";
import SignIn from "./components/SignIn.js";
import Docs from "./components/Docs.js";
import About from "./components/About.js";
import Dashboard from "./components/Dashboard.js";

class App extends Component{

  render(){
    return (
      <div className="App">
       <Header />
       <BrowserRouter>
        <Switch>
          <Route exact  path="/" component={Home} />
          <Route path="/SignUp" component={SignUp} />
          <Route path="/SignIn" component={SignIn} />
          <Route path="/Docs" component={Docs} />
          <Route path="/About" component={About} />
          <Route path="/Dashboard" component={Dashboard} />
        </Switch>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;
