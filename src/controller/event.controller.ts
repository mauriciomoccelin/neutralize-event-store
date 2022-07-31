import express, { Request } from "express";

import { Model } from "mongoose";
import { IEvent } from "../models/event.model";

import { authorize } from "../middlewares/authorize.middleware";
import { decodeTokenFromRequest } from "../helpers/jwt.helper";

const getById = (express: express.Express, eventModel: Model<IEvent>) => {
  const listRoutePath = "/nl-event-store/v1/event/get-by-id";

  express.get(listRoutePath, async (req, res) => {
    const session = decodeTokenFromRequest(req);

    const event = await eventModel.findOne({
      _id: req.query.id,
      tenantId: session.id,
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

  interface IPageRequest {
    limit: number;
    offset: number;
    type?: string;
    datetime: Date;
  }

  const getInput = (req: Request): IPageRequest => {
    const maxItemsResult = 10;

    const { limit, offset, type, datetime } = req.query;

    const typeString = String(type);
    const limitNumber = Number(limit);
    const offsetNumber = Number(offset);
    const dateTimeString = String(datetime);

    return {
      type: typeString,
      datetime: new Date(dateTimeString),
      offset: offsetNumber < 0 ? 0 : offsetNumber,
      limit: limitNumber > maxItemsResult ? maxItemsResult : offsetNumber,
    };
  };

  express.get(listRoutePath, async (req, res) => {
    const session = decodeTokenFromRequest(req);

    const { limit, offset, type, datetime } = getInput(req);

    const queryCount = eventModel.count();
    type && queryCount.where("type", type);
    queryCount.where("dateTime", { $gt: datetime });

    const filter = {
      tenantId: session.id,
      type: { $regex: type },
      dateTime: { $gte: datetime },
    };

    const projectionQuery = {
      type: 1,
      dateTime: 1,
      aggregateId: 1,
    };

    const queryItems = eventModel
      .find(filter, projectionQuery)
      .skip(Number(offset))
      .limit(limit)
      .sort({ dateTime: -1 });

    type && queryItems.where("type", type);

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
    this.express.use(authorize("Event"));
  }

  routes() {
    list(this.express, this.eventModel);
    getById(this.express, this.eventModel);
  }
}

export default EventController;
