import requestBrocker from "./request";

export default class KafkaBrocker {
  async start(): Promise<any> {
    await requestBrocker.start();
  }
}
