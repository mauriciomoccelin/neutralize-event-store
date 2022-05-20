import { start as eventsConsumerStarter } from "./events.consumer";

export const start = async () => {
  await eventsConsumerStarter();
  console.log('Kafka consumer started');
};

