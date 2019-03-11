const express = require('express');
const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require("graphql");
const app = express();


app.use(bodyParser.json());

app.use("/graphql", graphQLHttp({
	schema : buildSchema(`
		type RootQuery {
			events: [String!]!
		}

		type RootMutation {
			createEvent(name: String) : String
		}

		schema {
			query : RootQuery
			mutation : RootMutation
		}
	`),
	rootValue : {
		events: () => {
			return ["Cooking", "Coding", "Eating Cake"]
		},
		createEvent : (args) => {
			const eventName = args.name;
			return `Created Event : ${eventName}`;
		}
	},
	graphiql : true
}));


app.listen(3333);