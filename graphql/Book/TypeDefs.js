const typeDefs = `
  scalar Date

  type Book {
    id: ID!
    title: String!
    price: Float!
    author: String!
    publisher: String!
    publishAt: Date
  }

  type Query {
    getBook(id: ID!): Book
    getBooks: [Book]
  }

  type Mutation {
    addBook(title: String!, price: Float!, author: String!, publisher: String!, publishAt: Date): Book
    updateBook(title: String!, price: Float!, author: String!, publisher: String!, publishAt: Date): Book
    deleteBook(id: ID!): Book
  }
`;

module.exports = typeDefs;
