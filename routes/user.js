const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/user');
var { createHandler } = require("graphql-http/lib/use/express")
const typeDefs = require("../graphql/User/TypeDefs");
const resolvers = require("../graphql/User/Resolvers");
const { makeExecutableSchema } = require('@graphql-tools/schema');

const router = express.Router({mergeParams: true});

const { protect, authorize } = require('../middleware/auth');

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
router.route('/')
  .get(protect, authorize('admin', 'user'), getUsers);
router.route('/:id')
  .get(getUser)
  .put(protect, authorize('admin', 'user'),updateUser)
  .delete(protect, authorize('admin', 'user'), deleteUser);

module.exports = router;