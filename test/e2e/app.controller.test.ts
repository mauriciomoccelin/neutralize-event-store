import express from "express";
import jwt from "jsonwebtoken";
import request, { Response } from "supertest";

import database from "../../src/database";
import Event, { IEvent } from "../../src/models/event.model";
import Tenant from "../../src/models/tenant.model";

import { genereteEvent, genereteTenant } from "./fixturies/e2e.fixture";

import EventController from "../../src/controller/event.controller";

describe.only("application.controller", () => {
  let token: string;
  let eventId: string;
  let application: express.Application;

  beforeAll(async () => {
    application = new EventController(express(), Event).express;

    const tenant = genereteTenant();
    const newTenant = new Tenant(tenant);
    await newTenant.save();

    const event = genereteEvent(newTenant.id);
    const newEvent = new Event(event);
    await newEvent.save();

    eventId = newEvent.id.toString();

    const payload = {
      id: newTenant.id,
      role: "Tenant",
    };

    token = jwt.sign(payload, process.env.JWT_SECRET || "");
  });

  afterAll(async () => await database.disconnect());

  describe("when list events", () => {
    const query = {
      limit: 30,
      offset: 0,
      type: null,
      datetime: "2022-02-03",
    };

    let response: Response;
    beforeAll(async () => {
      response = await request(application)
        .get("/nl-event-store/v1/event/list")
        .set("Authorization", `Bearer ${token}`)
        .query(query);
    });

    it("should return status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should return a total greater than or equal zero", () => {
      const { items, total } = response.body;
      expect(total).toBeGreaterThan(0);
    });
  });

  describe("when get event by id", () => {
    let response: Response;
    beforeAll(async () => {
      response = await request(application)
        .get("/nl-event-store/v1/event/get-by-id")
        .set("Authorization", `Bearer ${token}`)
        .query({ id: eventId });
    });

    it("should return status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should return a event with the same id", () => {
      const result = response.body;
      expect(Object.values(result)).toContain(eventId);
    });
  });

  describe("when get event by id, but not found", () => {
    const query = {
      id: "62e5def95a1b0568706b3132",
    };

    const errorAssert = { error: "Event is not found." };

    let response: Response;
    beforeAll(async () => {
      response = await request(application)
        .get("/nl-event-store/v1/event/get-by-id")
        .set("Authorization", `Bearer ${token}`)
        .query(query);
    });

    it("should return status 404", () => {
      expect(response.status).toBe(404);
    });

    it("should be null", () => {
      const result = response.body;
      expect(result.error).toBe(errorAssert.error);
    });
  });
});
