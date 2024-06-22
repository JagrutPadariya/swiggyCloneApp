import * as express from "express";
import * as mongoose from "mongoose";
import { getEnvironmentVariables } from "./environments/environment";
import UserRouter from "./routers/UserRouter";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import BannerRouter from "./routers/BannerRouter";

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.setRoutes();
    this.error404Handler();
    this.handleErrors();
  }

  setConfigs() {
    this.connectMongoDB();
    this.configureBodyParser();
    this.allowCors();
  }

  connectMongoDB() {
    mongoose.connect(getEnvironmentVariables().db_uri).then(() => {
      console.log("Connected to mongodb.");
    });
  }

  configureBodyParser() {
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
  }

  allowCors() {
    this.app.use(cors());
  }

  setRoutes() {
    this.app.use("/src/uploads", express.static("src/uploads"));
    this.app.use("/api/user", UserRouter);
    this.app.use("/api/banner", BannerRouter);
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        messages: "Not found",
        status_code: 404,
      });
    });
  }

  handleErrors() {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        messages: error.message || "Something went wrong. Please try again!",
        status_code: errorStatus,
      });
    });
  }
}
