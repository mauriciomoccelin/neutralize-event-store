import { Kafka } from 'kafkajs'
import dbdf from '../config/database/definition'
import { saveLog } from '../helpers/knex-query-helper'

const kafka = new Kafka({
  clientId: 'graphql-logs-delivery-failed',
  brokers: [process.env.BROCKER_HOST]
})

const consumer = kafka.consumer({ groupId: 'logs-group-delivery-failed' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'logs.delivery.failed', fromBeginning: true })
  
  await consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async ({ topic, partition, message }) => {
      let input = JSON.parse(message.value)
      await saveLog(
        dbdf.table.deliveryFailed.name,
        dbdf.table.deliveryFailed.create(
          input.datetime,
          input.error,
          input.topic,
          input.message
        )
      )
      console.log({ topic, partition, offset: message.offset })
    }
  })
}

export default {
  start: async () => await run().catch(
    async () => await saveLog(
      dbdf.table.deliveryFailed.name,
      {
        datetime: new Date().toISOString(),
        error: null,
        topic: 'logs.delivery.failed',
        message: 'STARTUP ERROR'
      }
    )
  )
}
