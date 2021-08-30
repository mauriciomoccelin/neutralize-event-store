import event from "./events";
import { buildSchema } from "graphql";

const types = `
  ${event.type}
`;

const inputs = `
  ${event.input}
`;

const queries = `
  type Query {
    ${event.queries}
  }
`;

const mutations = `
  type Mutation {
    ${event.mutations}
  }
`;

export default buildSchema(`
  ${types}
  ${inputs}
  ${queries}
  ${mutations}
`);
