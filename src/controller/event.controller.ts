import express, { Request } from "express";

import { Model } from "mongoose";
import { IEvent } from "../models/event.model";

import { authorize } from "../middlewares/authorize.middleware";
import { decodeTokenFromRequest } from "../helpers/jwt.helper";

const getById = (express: express.Express, eventModel: Model<IEvent>) => {
  const listRoutePath = "/nl-event-store/v1/event/get-by-id";

  express.get(listRoutePath, authorize("Event"), async (req, res) => {
    const session = decodeTokenFromRequest(req);

    const event = await eventModel.findOne({
      _id: req.query.id,
      tenantId: session.tenantId,
    });

    if (!event) {
      return res.status(404).send({
        error: "Event is not found.",
      });
    }

    return res.send(event);
  });
};

const list = (express: express.Express, eventModel: Model<IEvent>) => {
  const listRoutePath = "/nl-event-store/v1/event/list";

  const invalidDate = "Date is required.";

  interface IPageRequest {
    date: string;
    limit: number;
    offset: number;
    type?: string;
  }

  const getInput = (req: Request): IPageRequest => {
    const maxItemsResult = 100;

    const { limit, offset, type, datetime } = req.query;

    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);
    const typeString = type ? type.toString() : "";
    const dateString = datetime ? datetime.toString() : "";

    return {
      type: typeString,
      date: dateString,
      offset: offsetNumber < 0 ? 0 : offsetNumber,
      limit: limitNumber > maxItemsResult ? maxItemsResult : limitNumber,
    };
  };

  express.get(listRoutePath, authorize("Event"), async (req, res) => {
    const session = decodeTokenFromRequest(req);

    const input = getInput(req);
    
    const filter = {
      tenantId: session.tenantId,
      type: { $regex: input.type },
      dateTime: { $gte: new Date(input.date) },
    };
    
    const projectionQuery = {
      type: 1,
      dateTime: 1,
      aggregateId: 1,
    };

    const queryCount = eventModel.countDocuments(filter);

    const queryItems = eventModel
      .find(filter, projectionQuery)
      .skip(input.offset)
      .limit(input.limit)
      .sort({ dateTime: -1 });

    const total = await queryCount.exec();
    const items = await queryItems.exec();

    const result = {
      total,
      items,
    };

    return res.send(result);
  });
};

class EventController {
  constructor(
    public express: express.Express,
    public eventModel: Model<IEvent>
  ) {
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    list(this.express, this.eventModel);
    getById(this.express, this.eventModel);
  }
}

export default EventController;
