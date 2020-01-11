import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from './src/api/schema'
import rootValue from './src/api/resolvers'
import kafka from './src/brocker/kafka'

var app = express();
var port = process.env.APP_PORT || 80

kafka.start().then(() => console.log('Kafka is starting'))

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true,
}))


app.listen(
  port, () => console.log(`Now browse to localhost:${port}/graphql`)
)