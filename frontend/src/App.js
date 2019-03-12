import React, { Component } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';

import AuthPage from './pages/Auth'
import BookingPage from './pages/Booking'
import EventPage from './pages/Event'

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <Switch>
            <Redirect from="/" to="/auth" exact/>
            <Route path="/auth" component = {AuthPage} />
            <Route path="/events" component = {EventPage} />
            <Route path="/bookings" component = {BookingPage} />
          </Switch>

        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
