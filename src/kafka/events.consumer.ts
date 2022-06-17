import { Kafka, EachMessagePayload } from "kafkajs";
import { decodeToken } from "../helpers/jwt.helper";
import { hasPermissionForRole } from "../helpers/permission.helper";

import Event, { IEvent } from "../models/event.model";

const start = async (kafka: Kafka) => {
  const consumer = kafka.consumer({ groupId: "nl.events.consumer" });

  await consumer.connect();
  await consumer.subscribe({ topic: "nl.tp.events", fromBeginning: true });

  await consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async (payload: EachMessagePayload) => {
      const { message } = payload;
      if (!message) return;

      const headers = message.headers || {};
      const token = Buffer.from(headers["X-NL-TOKEN"] || "").toString();

      const session = decodeToken(token);
      if (!session) throw new Error("Token is invalid");

      const isAuthorized = hasPermissionForRole(session.role, "Event");
      if (!isAuthorized) throw new Error("Unauthorized");

      const messageValue = Buffer.from(
        message.value?.toString() || ""
      ).toString();

      if (!messageValue) return;

      const event: IEvent = JSON.parse(messageValue);
      const eventModel = new Event(event);
      event.tenantId = session.id;

      await eventModel.save();

      console.log({
        event: event.type,
        tenantId: event.tenantId,
        aggregateId: event.aggregateId,
      });
    },
  });
};

export default start;
