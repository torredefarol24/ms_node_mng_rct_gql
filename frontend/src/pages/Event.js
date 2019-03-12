import React, { Component } from 'react';
import AuthContext from '../context/auth';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class EventsPage extends Component {
  state = {
	creating: false,
	events : []
  };

  constructor(props){
	  super(props);
	  this.titleElem = React.createRef();
	  this.priceElem = React.createRef();
	  this.dateElem = React.createRef();
	  this.descElem = React.createRef();

  }

  static contextType = AuthContext;

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
	this.setState({ creating: false });
	
	const title = this.titleElem.current.value;
	const price = this.priceElem.current.value;
	const date = this.dateElem.current.value;
	const description = this.descElem.current.value;

	if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0 ) {
		return;
	}

	const requestBody = {
		query: `
			mutation {
			  createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
				_id
				title
				description
				date
				price
				creator {
				  _id
				  email
				}
			  }
			}
		`
	};

	const token = this.context.token;

    fetch('http://localhost:3333/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
    .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
    .then(resData => {
        this.fetchEvents();
      })
    .catch(err => {
        console.log(err);
      });
  };


  fetchEvents() {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:3333/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        this.setState({ events: events });
      })
      .catch(err => {
        console.log(err);
      });
  }


  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  componentDidMount() {
    this.fetchEvents();
  }


  render() {
	const eventList = this.state.events.map(event => {
		return (
		  <li key={event._id} className="events__list-item">
			{event.title}
		  </li>
		);
	  });

	  return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
            <form>
				<div className ='mt16'>
					<label htmlFor="title">Title</label>
					<input type='text' className='form-control' id='title' ref={this.titleElem} />
				</div>
				<div className ='mt16'>
					<label htmlFor="price">Price</label>
					<input type='number' className='form-control' id='price' ref={this.priceElem}/>
				</div>
				<div className ='mt16'>
					<label htmlFor="description">Description</label>
					<input type='text' className='form-control' id='description' ref={this.descElem}/>
				</div>
				<div className ='mt16'>
					<label htmlFor="date">Date</label>
					<input type='date' className='form-control' id='date' ref={this.dateElem}/>
				</div>
			</form>
          </Modal>
        )}
        
		{this.context.token && (
          <div className="events-control">
            <p>Share your Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">{eventList}</ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
