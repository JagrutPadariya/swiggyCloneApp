import { Router } from "express";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";
import { CityController } from "../controllers/CityController";
import { CityValidators } from "../validators/CityValidators";

class CityRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.patchRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get("/", CityController.getCities);
  }

  postRoutes() {
    this.router.post(
      "/",
      CityValidators.addCity(),
      CityController.addCity
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new CityRouter().router;
