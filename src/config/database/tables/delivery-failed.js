const uuid = require('uuid/v1')

module.exports = {
  name: 'delivery_failed',
  field: {
    id: 'id',
    topic: 'topic',
    error: 'error',
    message: 'message',
    datetime: 'datetime'
  },
  create(datetime, error, topic, message) {
    return {
      id: uuid(),
      datetime: datetime || new Date().toISOString(),
      topic: topic,
      error: error,
      message: message
    }
  }
}