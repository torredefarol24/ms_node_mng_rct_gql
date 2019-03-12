import React from 'react';
import {NavLink} from 'react-router-dom';

import AuthContext from '../../context/auth';


const MainNavigation = props => (
	<AuthContext.Consumer>
		{
			context => {
				return (
					<header>
						<nav>
							<ul>
								<li className='li_brand'> Event Management </li> 
								{!context.token && <li> <NavLink to="/auth">Auth</NavLink> </li>}
								<li> <NavLink to="/events">Events</NavLink> </li>
								{context.token && <li> <NavLink to="/bookings">Booking</NavLink> </li>}
							</ul>
						</nav>
					</header>
				)
			}
		}
	</AuthContext.Consumer>
)

export default MainNavigation