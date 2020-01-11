import { Kafka } from 'kafkajs'
import db from '../config/database/connection'
import dbdf from '../config/database/definition'

const kafka = new Kafka({
  clientId: 'graphql-logs-requests',
  brokers: [process.env.BROCKER_HOST]
})

const consumer = kafka.consumer({ groupId: 'logs-group-requests' })

const saveLog = async input => await db(dbdf.table.request.name)
  .insert(
    dbdf.table.request.create(
      input.runtime,
      input.datetime,
      input.userAgent,
      input.request,
      input.response,
      input.identifier
    )
  ).table(dbdf.table.request.name)

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'logs.requests', fromBeginning: true })
  
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
    () => saveLog({
      datetime: new Date().toISOString(),
      runtime: '00:00:00.0000',
      userAgent: 'graphql-logs',
      response: 'STARTUP ERROR',
      identifier: 'IT WAS NOT POSSIBLE TO CONNECT IN KAFKA'
    })
  )
}
