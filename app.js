const express = require('express');
const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require("graphql");
const mongoose = require('mongoose');
const EventModel = require('./models/event');
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
				date: args.eventInput.date
			});

			return event.save()
			.then( result => {
				return { ...result._doc};
			})
			.catch(err => {
				console.log("event creation error ", err);
				throw err;
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
