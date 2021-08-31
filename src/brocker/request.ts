import { EachMessagePayload, Kafka } from "kafkajs";
import db from "../data/connection";
import { eventTable } from "../data/tables";

import { Event } from "../entities";

const kafka = new Kafka({
  clientId: "nl.events",
  brokers: [process.env.BROCKER_HOST || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "*" });

const saveLog = async (input: Event) =>
  await db(eventTable.name).insert(input).table(eventTable.name);

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "nl.tp.events", fromBeginning: true });

  await consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async (payload: EachMessagePayload) => {
      const input = new Event("", "", "", "", "");
      
      input.setEventId();
      input.setDatetime();
      input.eventType = Buffer.from(payload.message.key).toString();
      input.data = Buffer.from(payload.message.value || "").toString();

      await saveLog(input);
    },
  });
};

export default {
  start: async () =>
    await run().catch((reason) => {
      console.log(reason);
    }),
};
