if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import express from "express";
import { start as kafkaStart } from "./kafka";

// controllers
import EventController from "./controller/event.controller";
import TenantController from "./controller/tenant.controller";

// models
import EventModel from "./models/event.model";
import TenantModel from "./models/tenant.model";

const applicattion = express();
const port = process.env.APP_PORT;

new EventController(applicattion, EventModel);
new TenantController(applicattion, TenantModel);

kafkaStart();
applicattion.listen(port, () => console.log("Listening on port " + port));
