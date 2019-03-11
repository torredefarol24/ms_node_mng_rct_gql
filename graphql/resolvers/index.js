const EventModel = require('../../models/event')
const UserModel = require('../../models/user')
const bcrypt = require("bcryptjs");


const user = async userId => {
	try {
		const user = await UserModel.findById(userId)	
		return { ...user._doc, password : null, createdEvents : events.bind(this, user._doc.createdEvents )}
	} catch(err) {
		throw new Error(err)
	}
}

const events = async eventIds => {
	try{
		const events = await EventModel.find({ _id : { $in : eventIds}});
		events.map(event => {
			return { ...event._doc, date : new Date(event._doc.date).toISOString(), creator : user.bind(this, event.creator)}
		})
		return events
	}
	catch(err) {
		throw new Error(err)
	}
}


module.exports = {

	events: async () => {
		try {
			const events = await EventModel.find().populate("creator")
			events.map(event => {
				return { ...event._doc, date : new Date(event._doc.date).toISOString(), creator : user.bind(this, event._doc.creator) }
			})
			return events
		} catch(err){
			throw err
		}
	},

	createEvent : async (args) => {
		const event = new EventModel({
			title : args.eventInput.title,
			description : args.eventInput.description,
			price : +args.eventInput.price,
			date: args.eventInput.date,
			creator : "5c86648fba242b4d42dea4b9"
		});

		let createdEvent;

		try {
			const result = await event.save()
			createdEvent = { ...result._doc, creator : user.bind(this, result._doc.creator)}
			const creator = await UserModel.findById("5c86648fba242b4d42dea4b9")
			if (!creator){
				throw new Error("User Doesnt Exist")
			}
			creator.createdEvents.push(event)
			await creator.save()
			return createdEvent
		} catch(err) {
			console.log("event creation error ", err);
			throw err;
		}
	},

	createUser : async (args) => {

		try {
			const existingUser = await UserModel.findOne({ email : args.userInput.email})
			if (existingUser) {
				throw new Error("User Exists Already")
			}
			
			const passHash = await bcrypt.hash(args.userInput.password, 12)
			const creator = new UserModel({
				email : args.userInput.email,
				password : passHash
			})
			const result = await creator.save()
			return { ...result._doc, password : null}
		} catch(err) {
			console.log("Hashing error ", err)
			throw err
		}
		
	}
}