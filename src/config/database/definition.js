const integration = require('./tables/integration')
const request = require('./tables/request')
const deliveryFailed = require('./tables/delivery-failed')
const deliverySuccess = require('./tables/delivery-success')

module.exports = {
  databaseName: 'logs',
  table: {
    request,
    integration,
    deliveryFailed,
    deliverySuccess
  }
}