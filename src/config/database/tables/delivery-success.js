const uuid = require('uuid/v1')

module.exports = {
  name: 'delivery_success',
  field: {
    id: 'id',
    topic: 'topic',
    offset: 'offset',
    message: 'message',
    datetime: 'datetime',
    partitionOffset: 'partition_offset',
  },
  create(datetime, topic, offset, message, partitionOffset) {
    return {
      id: uuid(),
      datetime: datetime || new Date().toISOString(),
      topic: topic,
      offset: offset,
      partition_offset: partitionOffset,
      message: message
    }
  }
}