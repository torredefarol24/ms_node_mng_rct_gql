const express = require('express');
const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require("graphql");
const mongoose = require('mongoose');
const EventModel = require('./models/event');
const UserModel = require("./models/user");
const bcrypt = require("bcryptjs");
const app = express();


const events = [];

app.use(bodyParser.json());

app.use("/graphql", graphQLHttp({
	schema : buildSchema(`
		type Event {
			_id : ID!
			title : String!
			description : String!
			price : Float!
			date : String!
		}

		type User {
			_id : ID!
			email : String!
			password : String
			event : [Event]
		}

		input UserInput {
			email : String!
			password : String
		}

		input EventInput {
			title : String!
			description : String!
			price : Float!
			date : String!
		}

		type RootQuery {
			events: [Event!]!
		}

		type RootMutation {
			createEvent(eventInput: EventInput) : Event
			createUser(userInput: UserInput) : User
		}

		schema {
			query : RootQuery
			mutation : RootMutation
		}
	`),
	rootValue : {
		events: () => {
			return EventModel
			.find()
			.then( docs => {
				return docs.map(event => {
					return { ...event._doc}
				})
			})
			.catch(err => {
				throw err
			})
		},
		createEvent : (args) => {
			const event = new EventModel({
				title : args.eventInput.title,
				description : args.eventInput.description,
				price : +args.eventInput.price,
				date: args.eventInput.date,
				creator : "5c86648fba242b4d42dea4b9"
			});

			let createdEvent;

			return event.save()
			.then( result => {
				createdEvent = { ...result._doc}

				return UserModel.findById("5c86648fba242b4d42dea4b9")
				.then(user => {
					if (!user){
						throw new Error("User Doesnt Exist")
					}

					user.createdEvents.push(event)
					return user.save()
				})
			})
			.then(result => {
				return createdEvent;
			})
			.catch(err => {
				console.log("event creation error ", err);
				throw err;
			})
		},
		createUser : (args) => {

			return UserModel.findOne({ email : args.userInput.email})
			.then(user => {
				if (user) {
					throw new Error("User Exists Already")
				}
				
				return bcrypt.hash(args.userInput.password, 12)
			})
			.then(passHash => {

				const user = new UserModel({
					email : args.userInput.email,
					password : passHash
				})

				return user.save()
				.then(result => {
					return { ...result._doc, password : null}
				})
				.catch(err => {
					console.log("User creation error ", err)
					throw err
				})

			})
			.catch(err => {
				console.log("Hashing error ", err)
				throw err
			})
			
		}
	},
	graphiql : true
}));


mongoose.connect(`mongodb://localhost:27017/node_mng_rct_gql`, { useNewUrlParser: true})
.then( () => {
	app.listen(3333, () => console.log("Listening on Port:3333"));
})
.catch(err => {
	console.log(`Mongo Err : ${err}`)
})
