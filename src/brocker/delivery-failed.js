import { Kafka } from 'kafkajs'
import db from '../config/database/connection'
import dbdf from '../config/database/definition'

const kafka = new Kafka({
  clientId: 'graphql-logs-delivery-failed',
  brokers: [process.env.BROCKER_HOST]
})

const consumer = kafka.consumer({ groupId: 'logs-group-delivery-failed' })

const saveLog = async input => await db(dbdf.table.deliveryFailed.name)
  .insert(
    dbdf.table.deliveryFailed.create(
      input.datetime,
      input.error,
      input.topic,
      input.message
    )
  )

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'logs.delivery.failed', fromBeginning: true })
  
  await consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async ({ topic, partition, message }) => {
      let input = JSON.parse(message.value)
      await saveLog(input)
      console.log({ topic, partition, offset: message.offset })
    }
  })
}

export default {
  start: async () => await run().catch(
    async () => await saveLog(
      {
        datetime: new Date().toISOString(),
        error: null,
        topic: 'logs.delivery.failed',
        message: 'STARTUP ERROR'
      }
    )
  )
}
