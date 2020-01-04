import { Kafka } from 'kafkajs'
import db from '../config/database'
import dbdf from '../config/database/databaseDefinitions'

const kafka = new Kafka({
  clientId: 'graphql-logs',
  brokers: [process.env.BROCKER_HOST]
})

const consumer = kafka.consumer({ groupId: 'logs-group' })

const saveLog = async input => await db(dbdf.table.requests.name)
  .insert(
    dbdf.table.requests.create(
      input.datetime,
      input.runtime,
      input.userId,
      input.dataSend,
      input.dataReceived
    )
  ).table(dbdf.table.requests.name)

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'logs', fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let input = JSON.parse(message.value)
      await saveLog(input)
      console.log({
        topic,
        partition,
        offset: message.offset
      })
    }
  })
}

export default {
  start: async () => await run().catch(
    () => saveLog({
      datetime: new Date().toISOString(),
      runtime: '00:00:00.0000',
      userId: process.env.BROCKER_USER_ID,
      dataSend: 'STARTUP ERROR',
      dataReceived: 'IT WAS NOT POSSIBLE TO CONNECT IN KAFKA'
    })
  )
}
