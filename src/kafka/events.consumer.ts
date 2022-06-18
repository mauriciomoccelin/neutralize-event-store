import { Kafka, EachMessagePayload } from "kafkajs";
import { decodeToken } from "../helpers/jwt.helper";
import { hasPermissionForRole } from "../helpers/permission.helper";

import Event, { IEvent } from "../models/event.model";

const start = async (kafka: Kafka) => {
  const consumer = kafka.consumer({ groupId: "nl.events.consumer" });

  await consumer.connect();
  await consumer.subscribe({ topic: "nl.tp.events", fromBeginning: true });

  const logger = consumer.logger();

  await consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async (payload: EachMessagePayload) => {
      const { message } = payload;
      if (!message) {
        logger.error("No message received");
        return;
      };

      const headers = message.headers || {};
      const token = Buffer.from(headers["X-NL-TOKEN"] || "").toString();

      const session = decodeToken(token);
      if (!session) {
        logger.error("Invalid token");
        return;
      }

      const isAuthorized = hasPermissionForRole(session.role, "Event");
      if (!isAuthorized) {
        logger.error("Unauthorized");
        return;
      }

      const messageValue = Buffer.from(
        message.value?.toString() || ""
      ).toString();

      if (!messageValue) {
        logger.error("No message value");
        return;
      }

      const event: IEvent = JSON.parse(messageValue);
      event.tenantId = session.id;

      const eventModel = new Event(event);
      await eventModel.save();

      consumer.logger().info(`Event: ${event.type} processed`);
    },
  });
};

export default start;
