import React from 'react'
import AuthContext from '../context/auth';


class AuthPage extends React.Component {

	state = {
		isLogin : true
	}
	
	static contextType = AuthContext

	constructor(props){
		super(props);
		this.emailElem = React.createRef();
		this.passElem = React.createRef();
	}

	switchModeHandler = () => {
		this.setState({
			isLogin : !this.state.isLogin
		})
	}

	submitHandler = (event) => {
		event.preventDefault();

		const email = this.emailElem.current.value;
		const password = this.passElem.current.value;

		if (email.trim().length === 0 || password.trim().length === 0){
			return;
		}

		let reqBody = JSON.stringify({
			query : `
				query {
					login(email: "${email}", password : "${password}"){
						userId
						token
						tokenExpiration
					}
				}
			`
		})

		if (!this.state.isLogin){
			reqBody = JSON.stringify({
				query : `
					mutation {
						createUser(userInput:{
							email : "${email}",
							password : "${password}"
						}){
							_id
							email
						}
					}
				`
			})
		}

		const url = "http://localhost:3333/graphql"
		const reqOpts = {
			method : "POST",
			body : reqBody,
			headers : {
				"Content-Type" : "application/json",
			}
		}

		
		fetch(url, reqOpts)
		.then(res => res.json())
		.then(result => {
			if (result.data.login.token){
				this.context.login(result.data.login.token, result.data.login.userId, result.data.login.tokenExpiration)
			}
		})
		.catch(err => {
			console.error(err)
		})
	}


	render(){
		return(
			<div>
				<h3> {this.state.isLogin ? "Login" : "Signup"} Form</h3>
				<form onSubmit={this.submitHandler}>
					<div className='mt16'>
						<label htmlFor="email">Email</label>
						<input type='text' id='email' className='form-control' ref={this.emailElem}/>
					</div>
					<div className='mt16'>
						<label htmlFor="email">Password</label>
						<input type='password' id='password' className='form-control' ref={this.passElem}/>
					</div>
					<div className='mt16'>
						<button type='submit' className='btn_cust'>Submit</button>
						<button type='button' className='btn_cust' onClick={this.switchModeHandler}>
							Switch to {this.state.isLogin ? "Signup" : "Login"}
						</button>
					</div>
				</form>
			</div>
		)
	}
}

export default AuthPage