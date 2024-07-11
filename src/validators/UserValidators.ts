import { body, query, ValidationChain } from "express-validator";
import User from "../models/User";

export class UserValidators {
  static signup(): ValidationChain[] {
    return [
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email, // type: 'user'
          })
            .then((user) => {
              if (user) {
                // throw new Error("User Already Exists");
                throw "User Already Exists";
              } else {
                return true;
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("phone", "Phone number is required").isString(),
      body("password", "Password is required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be between 8-20 characters"),
      body("name", "Name is required").isString(),
      body("type", "User role type is required").isString(),
      body("status", "User status is required").isString(),
    ];
  }

  static verifyUserEmailToken(): ValidationChain[] {
    return [
      body(
        "verification_token",
        "Email verification token is required"
      ).isNumeric(),
    ];
  }

  static login(): ValidationChain[] {
    return [
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                req.user = user;
                return true;
              } else {
                // throw new Error("No User Registered with such Email");
                throw "No User Registered with such Email";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("password", "Password is required").isAlphanumeric(),
    ];
  }

  static checkResetPasswordEmail(): ValidationChain[] {
    return [
      query("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                return true;
              } else {
                // throw new Error("No User Registered with such Email");
                throw "No User Registered with such Email";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
    ];
  }

  static verifyResetPasswordToken(): ValidationChain[] {
    return [
      query("email", "Email is required").isEmail(),
      query("reset_password_token", "Reset password token is required")
        .isNumeric()
        .custom((reset_password_token, { req }) => {
          return User.findOne({
            email: req.query.email,
            reset_password_token: reset_password_token,
            reset_password_token_time: { $gt: Date.now() },
          })
            .then((user) => {
              if (user) {
                return true;
              } else {
                // throw new Error("Reset password token doesn't exist. Please regenerate a new token.");
                throw "Reset password token doesn't exist. Please regenerate a new token.";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
    ];
  }

  static resetPassword(): ValidationChain[] {
    return [
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                req.user = user;
                return true;
              } else {
                // throw new Error("No User Registered with such Email");
                throw "No User Registered with such Email";
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("new_password", "New password is required").isAlphanumeric(),
      body("reset_password_token", "Reset password token is required")
        .isNumeric()
        .custom((reset_password_token, { req }) => {
          if (req.user.reset_password_token == reset_password_token) {
            return true;
          } else {
            req.errorStatus = 422;
            // throw new Error("Reset password token is invalid, please try again");
            throw "Reset password token is invalid, please try again";
          }
        }),
    ];
  }

  static verifyPhoneNumber(): ValidationChain[] {
    return [body("phone", "Phone is required").isString()];
  }

  static verifyUserProfile(): ValidationChain[] {
    return [
      body("phone", "Phone is required").isString(),
      body("email", "Email is required")
        .isEmail()
        .custom((email, { req }) => {
          // console.log(req.user.email);
          // if (req.user.email == email)
          //   throw "Please provide a new unique Email Address to update the User Profile";
          return User.findOne({
            email: email,
          })
            .then((user) => {
              if (user) {
                // throw new Error("A User with entered email already exist, please provide a unique email id");
                throw "A User with entered email already exist, please provide a unique email id";
              } else {
                return true;
              }
            })
            .catch((e) => {
              throw new Error(e);
            });
        }),
      body("password", "Password is required").isAlphanumeric(),
    ];
  }

  static checkRefreshToken() {
    return [
      body("refreshToken", "Refresh token is required")
        .isString()
        .custom((refreshToken, { req }) => {
          if (refreshToken) {
            return true;
          } else {
            req.errorStatus = 403;
            // throw new Error("Access is forbidden");
            throw "Access is forbidden";
          }
        }),
    ];
  }
}
