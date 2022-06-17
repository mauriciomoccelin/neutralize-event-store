import express from "express";
import request, { Response } from "supertest";

import database from "../../src/database";
import Tenant from "../../src/models/tenant.model";
import TenantController from "../../src/controller/tenant.controller";
import { genereteTenant } from "./fixturies/e2e.fixture";

describe("tenant.controller /token", () => {
  let controller: express.Application;

  afterAll(async () => await database.disconnect());

  const tenant = genereteTenant();

  beforeAll(async () => {
    controller = new TenantController(express(), Tenant).express;
    await request(controller)
      .post("/nl-event-store/v1/tenant/register")
      .send(tenant);
  });

  describe("when send a invalid payload credentials", () => {
    describe("when NOT send a email", () => {
      let response: Response;
      beforeAll(async () => {
        const payload = {
          password: tenant.secret,
          email: "",
        };

        response = await request(controller)
          .post("/nl-event-store/v1/tenant/token")
          .send(payload);
      });

      it("should return a status 400", () => {
        expect(response.status).toBe(400);
      });

      it("should return a valid token", () => {
        const { error } = response.body;
        expect(error).toEqual("Invalid input");
      });
    });

    describe("when NOT send a email", () => {
      let response: Response;
      beforeAll(async () => {
        const payload = {
          password: "",
          email: tenant?.email,
        };

        response = await request(controller)
          .post("/nl-event-store/v1/tenant/token")
          .send(payload);
      });

      it("should return a status 400", () => {
        expect(response.status).toBe(400);
      });

      it("should return a valid token", () => {
        const { error } = response.body;
        expect(error).toEqual("Invalid input");
      });
    });
  });

  describe("when tenant not found by e-mail", () => {
    let response: Response;
    beforeAll(async () => {
      const payload = {
        password: tenant.secret,
        email: "error@mail.com",
      };

      response = await request(controller)
        .post("/nl-event-store/v1/tenant/token")
        .send(payload);
    });

    it("should return a status 404", () => {
      expect(response.status).toBe(404);
    });

    it("should return a valid token", () => {
      const { error } = response.body;
      expect(error).toEqual("Tenant not found");
    });
  });

  describe("when tenant password not match with payload", () => {
    let response: Response;
    beforeAll(async () => {
      const payload = {
        password: "error",
        email: tenant?.email,
      };

      response = await request(controller)
        .post("/nl-event-store/v1/tenant/token")
        .send(payload);
    });

    it("should return a status 400", () => {
      expect(response.status).toBe(400);
    });

    it("should return a valid token", () => {
      const { error } = response.body;
      expect(error).toEqual("Invalid password");
    });
  });

  describe("when send a valid tenant email and secret", () => {
    let response: Response;
    beforeAll(async () => {
      const payload = {
        password: tenant.secret,
        email: tenant?.email,
      };

      response = await request(controller)
        .post("/nl-event-store/v1/tenant/token")
        .send(payload);
    });

    it("should return a valid response", () => {
      expect(response.status).toBe(200);
    });

    it("should return a valid token", () => {
      const { token } = response.body;
      expect(token).not.toBeNull();
    });
  });
});
