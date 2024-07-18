import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../validators/UserValidators";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";

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
      "/send/reset/password/token",
      UserValidators.checkResetPasswordEmail(),
      GlobalMiddleWare.checkError,
      UserController.sendResetPasswordOtp
    );
    this.router.get(
      "/verify/resetPasswordToken",
      UserValidators.verifyResetPasswordToken(),
      GlobalMiddleWare.checkError,
      UserController.verifyResetPasswordToken
    );
    this.router.get("/profile", GlobalMiddleWare.auth, UserController.profile);
    this.router.get(
      "/exportToExcel",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.adminRole,
      UserController.exportUsersToExcel
    );
  }

  postRoutes() {
    this.router.post(
      "/login",
      UserValidators.login(),
      GlobalMiddleWare.checkError,
      UserController.login
    );
    this.router.post(
      "/logout",
      GlobalMiddleWare.auth,
      GlobalMiddleWare.decodeRefreshToken,
      UserController.logout
    );
    this.router.post(
      "/signup",
      UserValidators.signup(),
      GlobalMiddleWare.checkError,
      UserController.signup
    );
    this.router.post(
      "/refresh_token",
      GlobalMiddleWare.decodeRefreshToken,
      UserController.getNewToken
    );
  }

  patchRoutes() {
    this.router.patch(
      "/reset/password",
      UserValidators.resetPassword(),
      GlobalMiddleWare.checkError,
      UserController.resetPassword
    );
    this.router.patch(
      "/verify/emailToken",
      GlobalMiddleWare.auth,
      UserValidators.verifyUserEmailToken(),
      GlobalMiddleWare.checkError,
      UserController.verifyUserEmailToken
    );
    this.router.patch(
      "/update/phone",
      GlobalMiddleWare.auth,
      UserValidators.verifyPhoneNumber(),
      GlobalMiddleWare.checkError,
      UserController.updatePhoneNumber
    );
    this.router.patch(
      "/update/profile",
      GlobalMiddleWare.auth,
      UserValidators.verifyUserProfile(),
      GlobalMiddleWare.checkError,
      UserController.updateUserProfile
    );
  }

  putRoutes() {
    this.router.put(
      "/update/profilePic",
      GlobalMiddleWare.auth,
      new Utils().multer.single("profileImages"),
      UserValidators.userProfilePic(),
      GlobalMiddleWare.checkError,
      UserController.updateUserProfilePic
    );
  }

  deleteRoutes() {}
}

export default new UserRouter().router;
