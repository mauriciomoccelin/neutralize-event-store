import request from "supertest";

import app from "../src/app.controller";
import database from "../src/database";

describe("app.controller", () => {
  afterAll(async () => await database.disconnect());

  it("should send a valid request query", async () => {
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

    const response = await request(app)
      .post("/nl-event-store/v1/graphql?")
      .send(query);

    const { result } = response.body.data;

    expect(response.status).toBe(200);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  it("when send a invalid operation name", async () => {
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

    const response = await request(app)
      .post("/nl-event-store/v1/graphql?")
      .send(query);

    const { errors } = response.body;

    expect(response.status).toBe(500);
    expect(errors[0].message).toEqual(
      `Unknown operation named \"${operationName}\".`
    );
  });

  it("when send a query wintout datetime variable", async () => {
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

    const response = await request(app)
      .post("/nl-event-store/v1/graphql?")
      .send(query);

    const { errors } = response.body;

    expect(response.status).toBe(500);
    expect(errors[0].message).toEqual(
      'Variable "$datetime" of non-null type "String!" must not be null.'
    );
  });

  it("when send a valid mutation must return true", async () => {
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
          data: '{"id":"233cea12-d97c-11ec-9d64-0242ac120002"}',
          metadata: '[{"id":"233cea12-d97c-11ec-9d64-0242ac120002"}]',
        },
      },
      operationName: "addEvent",
    };

    const response = await request(app)
      .post("/nl-event-store/v1/graphql?")
      .send(query);

    const { data } = response.body;

    expect(response.status).toBe(200);
    expect(data["newEvent"]).toEqual(true);
  });

  it("when send a valid mutation without data and metada must return true", async () => {
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

    const response = await request(app)
      .post("/nl-event-store/v1/graphql?")
      .send(query);

    const { data } = response.body;

    expect(response.status).toBe(200);
    expect(data["newEvent"]).toEqual(true);
  });

  it("when send a invalid mutation without required fields must return false", async () => {
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

    const response = await request(app)
      .post("/nl-event-store/v1/graphql?")
      .send(query);

    const { errors } = response.body;

    expect(response.status).toBe(200);
    expect(errors[0].message).toContain("is required");
  });
});
