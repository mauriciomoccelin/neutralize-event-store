import { buildSchema } from 'graphql'
import requests from './requests'
import integrations from './integrations'

const types = `
  ${requests.type}
  ${integrations.type}
`
const inputs = `
  ${requests.input}
  ${integrations.input}
`
const querys = `
  type Query {
    ${requests.querys}
    ${integrations.querys}
  }
`
const mutations = `
  type Mutation {
    ${requests.mutations}
    ${integrations.mutations}
  }
`
export default buildSchema(`
  ${types}
  ${inputs}
  ${querys}
  ${mutations}
`)