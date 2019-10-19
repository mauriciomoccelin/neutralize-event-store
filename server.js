import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './src/api/schema'
import rootValue from './src/api/resolvers'

var app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true,
}))
app.listen(
  4000, 
  () => console.log('Now browse to localhost:4000/graphql')
)