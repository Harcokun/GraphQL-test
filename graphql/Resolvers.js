const User = require("../models/User");

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        return user;
      } catch (error) {
        throw new Error(`Failed to get user: ${error}`);
      }
    },
    users: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new Error(`Failed to get users: ${error}`);
      }
    },
  },
  Mutation: {
    createUser: async (_, { name, email, password }) => {
      try {
        const user = await User.create({ name, email, password });
        return user;
      } catch (error) {
        throw new Error(`Failed to create user: ${error}`);
      }
    },
    updateUser: async (_, { id, input }) => {
      try {
        const user = await User.findByIdAndUpdate(id, input, { new: true });
        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }
        return user;
      } catch (error) {
        throw new Error(`Failed to update user: ${error}`);
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }
        return { message: 'User deleted successfully' };
      } catch (error) {
        throw new Error(`Failed to delete user: ${error}`);
      }
    },
  },
};

module.exports = resolvers;
