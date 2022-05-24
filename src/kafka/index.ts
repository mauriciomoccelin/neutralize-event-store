import { Kafka } from "kafkajs";

import eventsConsumerStarter from "./events.consumer";

const brokerHost = process.env.BROCKER_HOST;
if (!brokerHost) throw new Error("No broker host provided");

const kafka = new Kafka({
  brokers: [brokerHost],
  clientId: "nl.events.store",
});

export const start = async () => {
  await eventsConsumerStarter(kafka);
  console.log("Kafka consumer started");
};
