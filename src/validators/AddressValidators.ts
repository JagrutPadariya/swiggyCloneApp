import { body, query, ValidationChain } from "express-validator";

export class AddressValidators {
  static addAddress(): ValidationChain[] {
    return [
      body("title", "Title is required").isString(),
      body("landmark", "Landmark is required").isString(),
      body("address", "Address is required").isString(),
      body("house", "House no. is required").isString(),
      body("lat", "Latitude is required").isNumeric(),
      body("lng", "Longitude is required").isNumeric(),
    ];
  }

  static editAddress(): ValidationChain[] {
    return [
      body("title", "Title is required").isString(),
      body("landmark", "Landmark is required").isString(),
      body("address", "Address is required").isString(),
      body("house", "House no. is required").isString(),
      body("lat", "Latitude is required").isNumeric(),
      body("lng", "Longitude is required").isNumeric(),
    ];
  }

  static checkAddress(): ValidationChain[] {
    return [
      query("lat", "Latitude is required").isNumeric(),
      query("lng", "Longitude is required").isNumeric(),
    ];
  }

  static getUserLimitedAddresses(): ValidationChain[] {
    return [query("limit", "Address limit is required").isNumeric()];
  }
}
