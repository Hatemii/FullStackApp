const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql").graphqlHTTP
const mongoose = require("mongoose")

const graphQLSchema = require("./graphql/schema/index")
const graphQLResolvers = require("./graphql/resolvers/index")

const app = express()
app.use(bodyParser.json())

app.use(
    '/graphql',
    graphqlHttp({
        schema: graphQLSchema,
        rootValue: graphQLResolvers,
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
