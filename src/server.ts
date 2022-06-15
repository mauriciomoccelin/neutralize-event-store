if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import { start as kafkaStart } from "./kafka";

kafkaStart();

import app from "./app.controller";
const port = process.env.APP_PORT;

app.listen(port, () => `Listening on port ${port}`);