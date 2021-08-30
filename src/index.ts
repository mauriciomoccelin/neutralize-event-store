import express from "express";
import { graphqlHTTP }  from "express-graphql";

import schema from "./graphql/schema";
import rootValue from "./graphql/resolvers";

import kafka from "./brocker";

var app = express();
var port = process.env.APP_PORT || 3000;

new kafka().start().then(() => console.log("Kafka is starting"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    rootValue: rootValue,
  })
);

app.listen(port, () => console.log(`Now browse to localhost:${port}/graphql`));
