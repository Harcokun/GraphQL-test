const typeDefs = `
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createAt: Date
  }

  type Response {
    success: Boolean!,
    message: String,
    token: String
  }

  directive @auth on FIELD_DEFINITION

  type Query {
    getMe: User! @auth
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, retype: String!, role: String): Response!,
    login(email: String!, password: String!): Response!,
    logout: Response! @auth 
  }
`;

module.exports = typeDefs;
