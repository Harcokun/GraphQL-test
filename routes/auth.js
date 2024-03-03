const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/auth');
const { graphqlHTTP } = require("express-graphql");
const schema = require("../graphql/Schema");
const resolvers = require("../graphql/Resolvers");

const router = express.Router({mergeParams: true});

// const {protect} = require('../middleware/auth');

// GraphQL endpoint
router.use(
    "/graphql",
    graphqlHTTP({
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