var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var BookModel = require('../models').Book;

var bookType = new GraphQLObjectType({
  name: "book",
  fields: function() {
    return {
      id: {
        type: GraphQLInt
      },
      isbn: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      author: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      publishedYear: {
        type: GraphQLInt
      },
      publisher: {
        type: GraphQLString
      },
      createdAt: {
        type: GraphQLDate
      },
      updatedAt: {
        type: GraphQLDate
      }
    };
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      books: {
        type: new GraphQLList(bookType),
        resolve: function () {
          const books = BookModel.findAll({
            order: [
              ['createdAt', 'DESC']
            ],
          })
          if (!books) {
            throw new Error('Error')
          }
          return books
        }
      },
      book: {
        type: bookType,
        args: {
          id: {
            name: 'id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const bookDetails = BookModel.findByPk(params.id).exec()
          if (!bookDetails) {
            throw new Error('Error')
          }
          return bookDetails
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({query: queryType});