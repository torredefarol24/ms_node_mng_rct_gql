import React from 'react';
import {NavLink} from 'react-router-dom';

const MainNavigation = props => (
	<header>
		<div className='navbar'>
			<h3>Event Management </h3> 
		</div>
		<nav>
			<ul>
				<li> <NavLink to="/auth">Auth</NavLink> </li>
				<li> <NavLink to="/events">Events</NavLink> </li>
				<li> <NavLink to="/bookings">Booking</NavLink> </li>
			</ul>
		</nav>
	</header>
)

export default MainNavigation