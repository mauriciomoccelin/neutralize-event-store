import express from "express";
import { graphqlHTTP } from "express-graphql";

import schema from "../graphql/schema";
import rootValue from "../graphql/resolvers";
import { authorize } from "../middlewares/authorize.middleware";

const registerGraphqlRoute = (express: express.Express) => {
  const graphqlRoutePath = "/nl-event-store/v1/graphql";

  express.use(
    graphqlRoutePath,
    graphqlHTTP({
      schema: schema,
      graphiql: true,
      rootValue: rootValue,
    })
  );
};

class AppController {
  constructor(public express: express.Express) {
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(authorize("Event"));
  }

  routes() {
    registerGraphqlRoute(this.express);
  }
}

export default AppController;
