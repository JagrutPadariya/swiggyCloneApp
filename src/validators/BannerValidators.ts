import { body } from "express-validator";

export class BannerValidators {
  static addBanner() {
    return [
      body("banner", "Banner image is required")
        .custom((banner, { req }) => {
          if (req.file) {
            return true;
          } else {
            // throw new Error("File not uploaded");
            throw "File not uploaded";
          }
        }),
    ];
  }
}
