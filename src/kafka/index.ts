import { start as eventsConsumerStarter } from "./events.consumer";

export const start = async () => {
  await eventsConsumerStarter();
};

