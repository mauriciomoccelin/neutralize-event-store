import express from "express";
import jwt from "jsonwebtoken";
import request, { Response } from "supertest";

import database from "../../src/database";
import Tenant from "../../src/models/tenant.model";
import { genereteTenant } from "./fixturies/e2e.fixture";

import AppController from "../../src/controller/app.controller";

describe("application.controller", () => {
  let token: string;
  let application: express.Application;

  beforeAll(async () => {
    application = new AppController(express()).express;

    const tenant = genereteTenant();
    const newTenant = new Tenant(tenant);
    await newTenant.save();

    const payload = {
      id: newTenant.id,
      role: "Tenant",
    };

    token = jwt.sign(payload, process.env.JWT_SECRET || "");
  });

  afterAll(async () => await database.disconnect());

  describe("when send a valid request query", () => {
    const query = {
      operationName: "GetPagedEvents",
      query: `
      query GetPagedEvents(\$datetime: String!, \$limit: Int, \$offset: Int, \$type: String) {
        result: getEvents(datetime: \$datetime, limit: \$limit, offset: \$offset, type: \$type) {
          total
          items {
            aggregateId,
            dateTime,
            type,
            data,
            metadata
          }
        }
      }`,
      variables: {
        limit: 30,
        offset: 0,
        type: null,
        datetime: "2023-02-03",
      },
    };

    let response: Response;
    beforeAll(async () => {
      response = await request(application)
        .post("/nl-event-store/v1/graphql?")
        .set("Authorization", `Bearer ${token}`)
        .send(query);
    });

    it("should return a valid response", () => {
      expect(response.status).toBe(200);
    });

    it("should return a total greater than or equal zero", () => {
      const { result } = response.body.data;
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe("when send a invalid operation name", () => {
    const operationName = "InvaliOperatioNname";
    const query = {
      operationName: operationName,
      query: `
      query GetPagedEvents(\$datetime: String!, \$limit: Int, \$offset: Int, \$type: String) {
        result: getEvents(datetime: \$datetime, limit: \$limit, offset: \$offset, type: \$type) {
          total
          items {
            aggregateId,
            dateTime,
            type,
            data,
            metadata
          }
        }
      }`,
      variables: {
        limit: 30,
        offset: 0,
        type: null,
        datetime: "2023-02-03",
      },
    };

    let response: Response;
    beforeAll(async () => {
      response = await request(application)
        .post("/nl-event-store/v1/graphql?")
        .set("Authorization", `Bearer ${token}`)
        .send(query);
    });

    it("should return a status 500", () => {
      expect(response.status).toBe(500);
    });

    it("should unknown operation named", () => {
      const { errors } = response.body;
      expect(errors[0].message).toEqual(
        `Unknown operation named \"${operationName}\".`
      );
    });
  });

  describe("when send a query wintout datetime variable", () => {
    const query = {
      operationName: "GetPagedEvents",
      query: `
      query GetPagedEvents(\$datetime: String!, \$limit: Int, \$offset: Int, \$type: String) {
        result: getEvents(datetime: \$datetime, limit: \$limit, offset: \$offset, type: \$type) {
          total
          items {
            aggregateId,
            dateTime,
            type,
            data,
            metadata
          }
        }
      }`,
      variables: {
        limit: 30,
        offset: 0,
        type: null,
        datetime: null,
      },
    };

    let response: Response;
    beforeAll(async () => {
      response = await request(application)
        .post("/nl-event-store/v1/graphql?")
        .set("Authorization", `Bearer ${token}`)
        .send(query);
    });

    it("should return a status 500", () => {
      expect(response.status).toBe(500);
    });

    it("should unknown operation named", () => {
      const { errors } = response.body;
      expect(errors[0].message).toEqual(
        'Variable "$datetime" of non-null type "String!" must not be null.'
      );
    });
  });
});
