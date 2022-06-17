if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import express from "express";
import { start as kafkaStart } from "./kafka";

// controllers
import AppController from "./controller/app.controller";
import TenantController from "./controller/tenant.controller";

// models
import TenantModel from "./models/tenant.model";

const applicattion = express();
const port = process.env.APP_PORT;

new AppController(applicattion);
new TenantController(applicattion, TenantModel);

kafkaStart();
applicattion.listen(port, () => console.log("Listening on port " + port));
