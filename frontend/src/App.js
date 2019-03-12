import React, { Component } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';

import AuthPage from './pages/Auth'
import BookingPage from './pages/Booking'
import EventPage from './pages/Event'

import './App.css';

import AuthContext from './context/auth';

class App extends Component {

  state = {
    token : null,
    userId : null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token : token,
      userId : userId
    })
  }

  logout = () => {
    this.setState({
      token : null,
      userId : null
    })
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={
              {
                token : this.state.token, 
                userId : this.state.userId, 
                login : this.login, 
                logout : this.logout 
              }
            }>
            <MainNavigation />
            <Switch>
              
              {!this.state.token && <Route path="/auth" component = {AuthPage} />}
              {!this.state.token && <Redirect from="bookings" to="/auth" exact/>}


              <Route path="/events" component = {EventPage} />
              {this.state.token && <Route path="/bookings" component = {BookingPage} />}
              {this.state.token && <Redirect from="/" to="/events" exact/>}
              {this.state.token && <Redirect from="/auth" to="/events" exact/>}

            </Switch>
          </AuthContext.Provider>

        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
