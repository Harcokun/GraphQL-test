const Book = require("../../models/Book");

const resolvers = {
  Query: {
    getBook: async (_, { id }) => {
      try {
        const book = await Book.findById(id);
        return book;
      } catch (error) {
        throw new Error(`Failed to get book: ${error}`);
      }
    },
    getBooks: async () => {
      try {
        const books = await Book.find();
        return books;
      } catch (error) {
        throw new Error(`Failed to get books: ${error}`);
      }
    },
  },
  Mutation: {
    addBook: async (_, { title, price, author, publisher, publishAt }) => {
      try {
        const book = await Book.create({ title, price, author, publisher, publishAt });
        return book;
      } catch (error) {
        throw new Error(`Failed to add book: ${error}`);
      }
    },
    updateBook: async (_, { id, input }) => {
      try {
        const book = await Book.findByIdAndUpdate(id, input, { new: true });
        if (!book) {
          throw new Error(`Book with id ${id} not found`);
        }
        return book;
      } catch (error) {
        throw new Error(`Failed to update book: ${error}`);
      }
    },
    deleteBook: async (_, { id }) => {
      try {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
          throw new Error(`Book with id ${id} not found`);
        }
        return { message: 'Book deleted successfully' };
      } catch (error) {
        throw new Error(`Failed to delete book: ${error}`);
      }
    },
  },
};

module.exports = resolvers;
