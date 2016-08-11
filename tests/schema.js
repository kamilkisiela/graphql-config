import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLSchema
} from 'graphql'

const WidgetType = new GraphQLObjectType({
  name: 'Widget',
  fields: () => ({
    count: {
      type: GraphQLInt
    }
  })
})

const BarType = new GraphQLObjectType({
  name: 'Bar',
  fields: () => ({
    widgets: {
      type: new GraphQLList(WidgetType)
    }
  })
})

const QueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    foo: {
      type: GraphQLString
    },
    bar: {
      type: BarType
    }
  })
})

module.exports = new GraphQLSchema({
  query: QueryType
})
