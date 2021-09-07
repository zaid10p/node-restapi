const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type AuthData {
        token : String!
        userId : String!
    }

    type RootQuery {
        hello : String!
        login(email: String!, password: String!) : AuthData
    }

    schema {
        query : RootQuery
    }
`);
