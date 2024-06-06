import { body } from "express-validator";

export class UserValidators {
  static signup() {
    return [
      body("email", "Email is required").isEmail(),
      body("phone", "Phone number is required").isString(),
      body("password", "Password is required")
        .isAlphanumeric()
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be between 8-25 characters"),
      body("name", "Name is required").isString(),
      body("type", "User role type is required").isString(),
      body("status", "User status is required").isString(),
    ];
  }

  static verifyUserEmail() {
    return [
      body(
        "verification_token",
        "Email verification token is required"
      ).isNumeric(),
      body("email", "Email is required").isEmail(),
    ];
  }
}
