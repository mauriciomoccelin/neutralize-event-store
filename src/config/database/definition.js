const integration = require('./tables/integration')
const request = require('./tables/request')

module.exports = {
  databaseName: 'logs',
  table: {
    integration,
    request
  }
}