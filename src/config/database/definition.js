const integration = require('./tables/integration')
const request = require('./tables/request')

module.exports = {
  dtabaseName: 'logs',
  table: {
    integration,
    request
  }
}