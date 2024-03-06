const express = require("express");
const { register, login, getMe, logout } = require("../controllers/auth");
var { createHandler } = require("graphql-http/lib/use/express");
const { graphqlHTTP } = require("express-graphql");
const typeDefs = require("../graphql/Auth/TypeDefs");
const resolvers = require("../graphql/Auth/Resolvers");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const router = express.Router();
const { protect } = require("../middleware/auth");

// express graphql expects your resolvers to be part of your schema.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// GraphQL endpoint
router.use(
  "/graphql",
  protect,
  graphqlHTTP((req, res) => {
    console.log(`user in route: ${req.user}`);
    return {
      schema,
      rootValue: resolvers,
      context: { req: req, res: res },
      graphiql: true,
    };
  })
);

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout", logout);

module.exports = router;
