const EventModel = require("../../model/events")
const UserModel = require("../../model/user")
const bcrypt = require('bcryptjs');

module.exports = {

    // GET EVENTS
    events: async () => {
        try {
            const events = await EventModel.find().populate("creator")
            return events
        } catch (err) {
            throw err
        }
    },

    //example of populate("creator") in graphql
    // query {
    //      events {
    //          title
    //          description
    //          price
    //          date
    //          creator {
    //              email     
    //              password
    //          }
    //      }
    // }
    // populate() --> to return data from related DB in this case ref:User 
    // email and password --> will not be able to see without populate()



    // POST EVENTS
    createEvent: async (args) => {
        const event = new EventModel({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "6048c528b401e8eef22a6940"
        });

        let createdEvent;
        try {
            const result = await event.save()

            createdEvent = result
            const creator = await UserModel.findById("6048c528b401e8eef22a6940")

            if (!creator) { // if we don't have a user
                throw new Error("User not found")
            }

            creator.createdEvents.push(event);
            await creator.save()

            return createdEvent

        } catch (err) {
            throw (err)
        }
    },

    // POST USERS
    createUser: async (args) => {
        try {
            // first check if user exist in db
            const existingUser = await UserModel.findOne({ email: args.userInput.email })
            if (existingUser) { // if user === true
                throw new Error("User already exist")
            }

            // decrypt password with bcrypt
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const user = new UserModel({
                email: args.userInput.email,
                password: hashedPassword, // password has stored in db in hash type
            })

            const result = await user.save()
            return result // if will saved successfully in db --> return result to graphql

        } catch (err) {
            throw (err)
        }
    },
}