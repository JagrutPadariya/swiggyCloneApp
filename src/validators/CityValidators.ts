import { body, ValidationChain } from "express-validator";

export class CityValidators {
  static addCity() {
    return [body("name", "City Name is required").isString];
  }
}
