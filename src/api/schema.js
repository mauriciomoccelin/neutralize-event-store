import { buildSchema } from 'graphql'

const integrationLogFields = `
  datetime: String!,
  runtime: String!,
  userId: String!,
  dataSend: String,
  dataReceived: String
`
const types = `
  type IntegrationLog {
    id: String!,
    ${integrationLogFields}
  }
`
const inputs = `
  input IntegrationLogInput {
    ${integrationLogFields}
  }
`
const querys = `
  type Query {
    getIntegrationsLog: [IntegrationLog!]!
    getIntegrationLogById(id: String!): IntegrationLog
  }
`
const mutations = `
  type Mutation {
    newIntegrationLog(input: IntegrationLogInput!): Boolean
  }
`
export default buildSchema(`
  ${types}
  ${inputs}
  ${querys}
  ${mutations}
`)