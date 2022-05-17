import { start as eventsConsumerStarter } from "./events.consumer";

export default class KafkaBrocker {
  async start(): Promise<any> {
    await eventsConsumerStarter();
  }
}
