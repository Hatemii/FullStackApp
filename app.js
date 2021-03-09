const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql").graphqlHTTP
const { buildSchema } = require("graphql")

const app = express()
app.use(bodyParser.json())


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }


        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),

    rootValue: {
        events: () => {
            return ["All Star", "3PT Shooting", "Steph Curry"]
        },
        createEvent: (args) => {
            const eventName = args.name
            return eventName
        }
    },

    graphiql: true

})
);

// test on graphql

// query{
//     events
// }

// mutation{
//     createEvent(
//         name: "test"
//     )
// }

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server started on port ${port}`))
