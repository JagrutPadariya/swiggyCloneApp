import { Router } from "express";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { RestaurantController } from "../controllers/RestaurantController";
import { RestaurantValidators } from "../validators/RestaurantValidators";
import { Utils } from "../utils/Utils";

class RestaurantRouter {
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
      "/nearbyRestaurants",
      GlobalMiddleWare.auth,
      RestaurantValidators.getNearbyRestaurants(),
      GlobalMiddleWare.checkError,
      RestaurantController.getNearbyRestaurants
    );
    this.router.get(
      "/searchNearbyRestaurants",
      GlobalMiddleWare.auth,
      RestaurantValidators.searchNearbyRestaurants(),
      GlobalMiddleWare.checkError,
      RestaurantController.searchNearbyRestaurants
    );
  }

  postRoutes() {
    this.router.post(
      "/",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      new Utils().multer.single("restaurantImages"),
      RestaurantValidators.addRestaurant(),
      GlobalMiddleWare.checkError,
      RestaurantController.addRestaurant
    );
  }

  patchRoutes() {}

  putRoutes() {}

  deleteRoutes() {}
}

export default new RestaurantRouter().router;
