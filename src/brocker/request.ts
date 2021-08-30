import { Kafka } from "kafkajs";
import db from "../data/connection";
import { eventTable } from "../data/tables";

import { Event } from "../entities";

const kafka = new Kafka({
  clientId: "nl.events",
  brokers: [process.env.BROCKER_HOST || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "nl.gr.events" });

const saveLog = async (input: Event) =>
  await db(eventTable.name).insert(input).table(eventTable.name);

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "nl.tp.events", fromBeginning: true });

  await consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async ({ topic, partition, message }) => {
      const json = message.value?.toString() || "";
      const input = JSON.parse(json);
      await saveLog(input);
      console.log({ topic, partition, offset: message.offset });
    },
  });
};

export default {
  start: async () =>
    await run().catch(() => {
      const payload = JSON.stringify("It was not possible to connect in kafka");
      const input = eventTable.create(payload);

      saveLog(input);
    }),
};
