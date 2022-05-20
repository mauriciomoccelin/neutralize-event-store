import { Kafka, EachMessagePayload } from "kafkajs";

import Event, { IEvent } from "../models/event.model";

const brokerHost = process.env.BROCKER_HOST;
if (!brokerHost) throw new Error("No broker host provided");

const kafka = new Kafka({
  clientId: "nl.events.consumer",
  brokers: [brokerHost],
});

export const start = async () => {
  const consumer = kafka.consumer({ groupId: "nl.events.consumer" });

  await consumer.connect();
  await consumer.subscribe({ topic: "nl.tp.events", fromBeginning: true });

  await consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async (payload: EachMessagePayload) => {
      const { message } = payload;
      if (!message) return;

      const messageValue = Buffer.from(
        message.value?.toString() || ""
      ).toString();

      if (!messageValue) return;

      const event: IEvent = JSON.parse(messageValue);
      const eventModel = new Event(event);
      await eventModel.save();
    },
  });
};
