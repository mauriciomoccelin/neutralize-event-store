import { Kafka } from 'kafkajs'
import dbdf from '../config/database/definition'
import { saveLog } from '../helpers/knex-query-helper'

const kafka = new Kafka({
  clientId: 'graphql-logs-delivery-success',
  brokers: [process.env.BROCKER_HOST]
})

const consumer = kafka.consumer({ groupId: 'logs-group-delivery-success' })
const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'logs.delivery.success', fromBeginning: true })
  
  await consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async ({ topic, partition, message }) => {
      let input = JSON.parse(message.value)
      await saveLog(
        dbdf.table.deliverySuccess.name,
        dbdf.table.deliverySuccess.create(
          input.datetime,
          input.topic,
          input.offset,
          input.message,
          input.partitionOffset
        )
      )
      console.log({ topic, partition, offset: message.offset })
    }
  })
}

export default {
  start: async () => await run().catch(
    async () => await saveLog(
      dbdf.table.deliverySuccess.name,
      {
        datetime: new Date().toISOString(),
        topic: 'logs.delivery.success',
        offset: null,
        message: 'STARTUP ERROR',
        partitionOffset: null
      }
    )
  )
}
