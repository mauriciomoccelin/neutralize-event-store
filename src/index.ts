import express from "express";
import { graphqlHTTP } from "express-graphql";

import schema from "./graphql/schema";
import rootValue from "./graphql/resolvers";
import { start as kafkaStart } from "./kafka";

kafkaStart();

const app = express();
const port = process.env.APP_PORT;
const graphqlRoute = "/nl-event-store/v1/graphql";

app.use(
  graphqlRoute,
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    rootValue: rootValue,
  })
);

app.listen(port);
