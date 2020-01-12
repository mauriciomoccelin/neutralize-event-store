const fields = `
  datetime: String!,
  runtime: String!,
  userId: String,
  dataSend: String,
  dataReceived: String
`

const type = `
  type IntegrationLog {
    id: String!,
    ${fields}
  }
`

const input = `
  input IntegrationLogInput {
    ${fields}
  }
`

const querys = `
    getIntegrationsLog(datetime: String!, limit: Int, offset: Int, search: String): [IntegrationLog!]!
    getIntegrationLogById(id: String!): IntegrationLog
`

const mutations = `
    newIntegrationLog(input: IntegrationLogInput!): Boolean
`

export default {
  type,
  input,
  querys,
  mutations
}