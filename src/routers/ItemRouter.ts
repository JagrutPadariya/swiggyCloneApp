import { Router } from "express";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { ItemController } from "../controllers/ItemController";
import { ItemValidators } from "../validators/ItemValidators";
import { Utils } from "../utils/Utils";

class ItemRouter {
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
    this.router.get(
      "/menuItems/:restaurantId",
      GlobalMiddleWare.auth,
      ItemValidators.getMenuItems(),
      GlobalMiddleWare.checkError,
      ItemController.getMenu
    );
  }

  postRoutes() {
    this.router.post(
      "/",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("itemImages"),
      ItemValidators.addItem(),
      GlobalMiddleWare.checkError,
      ItemController.addItem
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new ItemRouter().router;
