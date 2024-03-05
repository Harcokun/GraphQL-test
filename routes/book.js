const express = require('express');
const { getBook, getBooks, addBook, updateBook, deleteBook } = require('../controllers/book');
var { createHandler } = require("graphql-http/lib/use/express")
const typeDefs = require("../graphql/Book/TypeDefs");
const resolvers = require("../graphql/Book/Resolvers");
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
router.post('/add', protect, authorize('admin'), addBook);
router.route('/')
  .get(protect, authorize('admin'), getBooks);
router.route('/:id')
  .get(getBook)
  .put(protect, authorize('admin'), updateBook)
  .delete(protect, authorize('admin'), deleteBook);

module.exports = router;