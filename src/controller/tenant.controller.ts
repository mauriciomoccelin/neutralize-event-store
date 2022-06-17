import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";

import { Model } from "mongoose";
import { ITenant } from "../models/tenant.model";

const token = (express: express.Express, tenantModel: Model<ITenant>) => {
  const authRoutePath = "/nl-event-store/v1/tenant/token";

  express.post(authRoutePath, async (req, res) => {
    const { email, password } = req.body;

    const isValidInput = email && password;
    if (!isValidInput) return res.status(400).send({ error: "Invalid input" });

    const tenant = await tenantModel
      .findOne({ email: email.toLowerCase() })
      .select("+secret");

    if (tenant === null)
      return res.status(404).send({ error: "Tenant not found" });

    const isPasswordMatch = await bcrypt.compare(
      password.toString(),
      tenant?.secret || ""
    );

    if (!isPasswordMatch)
      return res.status(400).send({ error: "Invalid password" });

    const secret = process.env.JWT_SECRET || "";
    const payload = {
      role: "Tenant",
      tenantId: tenant?._id,
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: "1h",
    });

    return res.status(200).send({ token });
  });
};

const register = (express: express.Express, tenantModel: Model<ITenant>) => {
  const authRoutePath = "/nl-event-store/v1/tenant/register";

  express.post(authRoutePath, async (req, res) => {
    const tenant = req.body as ITenant;

    if (!tenant || !tenant.email)
      return res.status(400).send({ error: "Invalid input" });

    const tenantExists = await tenantModel.exists({
      email: tenant.email.toLowerCase(),
    });

    if (tenantExists) {
      return res.status(400).send({ error: "Tenant already exists" });
    }

    const newTenant = new tenantModel(tenant);
    const validation = newTenant.validateSync();

    if (validation)
      return res.status(400).send({ error: validation.message });

    await newTenant.save();

    return res.status(200).send({ message: "Tenant created" });
  });
};

class TenantController {
  constructor(
    public express: express.Express,
    public tenantModel: Model<ITenant>
  ) {
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    token(this.express, this.tenantModel);
    register(this.express, this.tenantModel);
  }
}

export default TenantController;
