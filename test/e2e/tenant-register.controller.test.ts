import express from "express";
import request, { Response } from "supertest";

import database from "../../src/database";
import Tenant from "../../src/models/tenant.model";
import TenantController from "../../src/controller/tenant.controller";

import { genereteTenant } from "./fixturies/e2e.fixture";

describe("tenant.controller /register", () => {
  let controller: express.Application;

  afterAll(async () => await database.disconnect());

  beforeAll(async () => {
    controller = new TenantController(express(), Tenant).express;
  });

  describe("when not send a tenant e-mail", () => {
    let response: Response;
    beforeAll(async () => {
      const payload = genereteTenant();
      payload.email = "";

      response = await request(controller)
        .post("/nl-event-store/v1/tenant/register")
        .send(payload);
    });

    it("should return a status 400", () => {
      expect(response.status).toBe(400);
    });

    it("should return a error", () => {
      const { error } = response.body;
      expect(error).toEqual("Invalid input");
    });
  });

  describe("when send tenant with e-mail, but tenant already exists", () => {
    let response: Response;
    beforeAll(async () => {
      const payload = genereteTenant();
      
      response = await request(controller)
        .post("/nl-event-store/v1/tenant/register")
        .send(payload);

      response = await request(controller)
        .post("/nl-event-store/v1/tenant/register")
        .send(payload);
    });

    it("should return a status 400", () => {
      expect(response.status).toBe(400);
    });

    it("should return a error", () => {
      const { error } = response.body;
      expect(error).toEqual("Tenant already exists");
    });
  });

  describe("when send tenant with e-mail, but tenant is not valid", () => {
    let response: Response;
    beforeAll(async () => {
      const payload = genereteTenant();
      payload.description = "";

      response = await request(controller)
        .post("/nl-event-store/v1/tenant/register")
        .send(payload);
    });

    it("should return a status 400", () => {
      expect(response.status).toBe(400);
    });

    it("should return a error", () => {
      const { error } = response.body;
      expect(error).not.toBeNull();
    });
  });

  describe("when send a valid tenant", () => {
    let response: Response;
    beforeAll(async () => {
      response = await request(controller)
        .post("/nl-event-store/v1/tenant/register")
        .send(genereteTenant());
    });

    it("should return a status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should return a success", () => {
      const { message } = response.body;
      expect(message).toEqual("Tenant created");
    });
  });
});
