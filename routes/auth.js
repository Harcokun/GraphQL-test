const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/auth');
var { createHandler } = require("graphql-http/lib/use/express")
const typeDefs = require("../graphql/TypeDefs");
const resolvers = require("../graphql/Resolvers");
const { makeExecutableSchema } = require('@graphql-tools/schema');

const router = express.Router({mergeParams: true});

// const {protect} = require('../middleware/auth');

const schema = makeExecutableSchema({ typeDefs, resolvers })

// GraphQL endpoint
router.use(
    "/graphql",
    createHandler({
      schema,
      rootValue: resolvers,
      graphiql: true,
    })
  );

// Example non-GraphQL route
router.post('/register', createUser);
router.get('/', getUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;