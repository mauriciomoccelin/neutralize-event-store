import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './src/api/schema'
import rootValue from './src/api/resolvers'
import kafka from './src/brocker/kafka'

var app = express();

kafka.start()

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true,
}))

app.listen(
  4000, 
  () => console.log('Now browse to localhost:4000/graphql')
)