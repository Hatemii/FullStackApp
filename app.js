const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql").graphqlHTTP
const { buildSchema } = require("graphql")
const mongoose = require("mongoose")
const EventModel = require("./model/events")
const UserModel = require("./model/user")
const bcrypt = require('bcryptjs');

const app = express()
app.use(bodyParser.json())


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String! 
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }


        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }


        type RootMutation {
            createEvent(eventInput: EventInput): Event
            updateEvent(id: ID!, eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),


    rootValue: {

        // GET
        events: () => {
            return EventModel.find()
                .then(result => {
                    return result
                })
                .catch(err => {
                    console.log(err);
                    throw err
                })
        },

        // POST EVENTS
        createEvent: (args) => {
            const event = new EventModel({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })

            return event.save()
                .then(result => {
                    return result // in graphql to return query after clicking RUN MUTATION
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },

        // UPDATE
        // updateEvent: (args) => {
        //     if (!args.id) return
        //     return EventModel.updateOne({ _id: args.id },
        //         {
        //             $set: {
        //                 title: args.eventInput.title,
        //                 description: args.eventInput.description,
        //                 price: +args.eventInput.price,
        //                 date: new Date(args.eventInput.date)
        //             }
        //         }).then(result => {
        //             console.log(result)
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             throw err
        //         })
        // },



        // POST USERS
        createUser: (args) => {
            // first check if user exist in db
            return UserModel.findOne({ email: args.userInput.email })
                .then(user => {
                    if (user) { // if user === true
                        throw new Error("User already exist")
                    }
                    // decrypt password with bcrypt
                    return bcrypt.hash(args.userInput.password, 12)
                })
                .then(hashedPassword => {
                    const user = new UserModel({
                        email: args.userInput.email,
                        password: hashedPassword, // password has stored in db in hash type
                    })
                    return user.save()
                })
                .then(result => {
                    return result // if will saved successfully in db --> return result to graphql
                })
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },



    },

    graphiql: true

})
);



// Database Connection
mongoose.connect(
    `mongodb+srv://user:zpl0IPjl1tsjYbzk@realmcluster.vgqgf.mongodb.net/newDB?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});


// PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server started on port ${port}`))
