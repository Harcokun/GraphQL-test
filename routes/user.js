const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/user');
var { createHandler } = require("graphql-http/lib/use/express")
const typeDefs = require("../graphql/TypeDefs");
const resolvers = require("../graphql/Resolvers");
const { makeExecutableSchema } = require('@graphql-tools/schema');

const router = express.Router({mergeParams: true});

const {protect} = require('../middleware/auth');

// express graphql expects your resolvers to be part of your schema.
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
router.post('/create', createUser);
router.get('/', getUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;