const Event = require('../../models/event');
const User = require("../../models/user");
const { transformEvent } = require('./merge');
  
module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(event => {
          return transformEvent(event);
        });
      } catch (err) {
        throw err;
      }
    },
    createEvent: async args => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5c86648fba242b4d42dea4b9'
      });
      let createdEvent;
      try {
        const result = await event.save();
        createdEvent = transformEvent(result);
        const creator = await User.findById('5c86648fba242b4d42dea4b9');
  
        if (!creator) {
          throw new Error('User not found.');
        }
        creator.createdEvents.push(event);
        await creator.save();
  
        return createdEvent;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  };
