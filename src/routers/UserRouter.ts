import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";

class UserRouter {
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
      "/send/verification/email",
      GlobalMiddleWare.auth,
      UserController.resendVerificationEmail
    );
    this.router.get(
      "/login",
      UserValidators.login(),
      GlobalMiddleWare.checkError,
      UserController.login
    );
  }

  postRoutes() {
    this.router.post(
      "/signup",
      UserValidators.signup(),
      GlobalMiddleWare.checkError,
      UserController.signup
    );
  }

  patchRoutes() {
    this.router.patch(
      "/verify",
      UserValidators.verifyUser(),
      GlobalMiddleWare.checkError,
      GlobalMiddleWare.auth,
      UserController.verify
    );
  }

  putRoutes() {}

  deleteRoutes() {}
}

export default new UserRouter().router;
