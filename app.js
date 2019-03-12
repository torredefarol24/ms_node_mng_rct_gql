const express = require('express');
const bodyParser = require('body-parser');
const graphQLHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphQLSchema = require("./graphql/schema/index")
const graphQLResolvers = require("./graphql/resolvers/index")
const isAuth = require("./middleware/isAuth");
const app = express();


app.use(bodyParser.json());

app.use( (req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
	if (req.method === 'OPTIONS'){
		return res.sendStatus(200);
	}
	next();
})

app.use(isAuth);

app.use("/graphql", graphQLHttp({
	schema : graphQLSchema,
	rootValue : graphQLResolvers,
	graphiql : true
}));


mongoose.connect(`mongodb://localhost:27017/node_mng_rct_gql`, { useNewUrlParser: true, useCreateIndex : true})
.then( () => {
	app.listen(3333, () => console.log("Listening on Port:3333"));
})
.catch(err => {
	console.log(`Mongo Err : ${err}`)
})
