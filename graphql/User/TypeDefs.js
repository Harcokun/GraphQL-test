const typeDefs = `
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createAt: Date
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }

  type Mutation {
    createUser(name: String!, email: String!, role: String, password: String!): User
    updateUser(id: ID!, name: String, email: String, role: String, password: String): User
    deleteUser(id: ID!): User
  }
`;

module.exports = typeDefs;
