import request, { Response } from "supertest";

import app from "../../src/app.controller";
import database from "../../src/database";

describe("app.controller", () => {
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
      response = await request(app)
        .post("/nl-event-store/v1/graphql?")
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
      response = await request(app)
        .post("/nl-event-store/v1/graphql?")
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
      response = await request(app)
        .post("/nl-event-store/v1/graphql?")
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

  describe("when send a valid mutation must return true", () => {
    const query = {
      query: `
        mutation addEvent ($input: EventInput!) {
          newEvent(input: $input)
        }
      `,
      variables: {
        input: {
          type: "EventType",
          dateTime: "2022-03-08",
          aggregateId: "233cea12-d97c-11ec-9d64-0242ac120002",
          data: JSON.stringify({
            age: 30,
            name: "John Doe",
          }),
          metadata: JSON.stringify({
            ip: "192.168.1.80",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
          }),
        },
      },
      operationName: "addEvent",
    };

    let response: Response;
    beforeAll(async () => {
      response = await request(app)
        .post("/nl-event-store/v1/graphql?")
        .send(query);
    });

    it("should return a status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should return new event equals true", () => {
      const { data } = response.body;
      expect(data["newEvent"]).toEqual(true);
    });
  });

  describe("when send a valid mutation without data and metada must return true", () => {
    const query = {
      query: `
        mutation addEvent ($input: EventInput!) {
          newEvent(input: $input)
        }
      `,
      variables: {
        input: {
          type: "EventType",
          dateTime: "2022-03-08",
          aggregateId: "233cea12-d97c-11ec-9d64-0242ac120002",
          data: null,
          metadata: null,
        },
      },
      operationName: "addEvent",
    };

    let response: Response;
    beforeAll(async () => {
      response = await request(app)
        .post("/nl-event-store/v1/graphql?")
        .send(query);
    });

    it("should return a status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should return new event equals true", () => {
      const { data } = response.body;
      expect(data["newEvent"]).toEqual(true);
    });
  });

  describe("when send a invalid mutation without required fields must return false", () => {
    const query = {
      query: `
        mutation addEvent ($input: EventInput!) {
          newEvent(input: $input)
        }
      `,
      variables: {
        input: {
          type: "",
          dateTime: "",
          aggregateId: "",
          data: null,
          metadata: null,
        },
      },
      operationName: "addEvent",
    };

    let response: Response;
    beforeAll(async () => {
      response = await request(app)
        .post("/nl-event-store/v1/graphql?")
        .send(query);
    });

    it("should return a status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should return new event equals true", () => {
      const { errors } = response.body;
      expect(errors[0].message).toContain("is required");
    });
  });
});
