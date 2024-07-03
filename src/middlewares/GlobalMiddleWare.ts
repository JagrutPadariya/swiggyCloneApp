import { validationResult } from "express-validator";
import { Jwt } from "../utils/Jwt";

export class GlobalMiddleWare {
  static checkError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  }

  static async auth(req, res, next) {
    const header_auth = req.headers.authorization;
    const token = header_auth ? header_auth.slice(7, header_auth.length) : null;
    try {
      if (!token) {
        req.errorStatus = 401;
        next(new Error("User doesn't exist1"));
      }
      const decoded = await Jwt.jwtVerify(token);
      req.user = decoded;
      console.log(
        "------------------------------------------Middleware Decoding JWT------------------------------"
      );
      console.log(JSON.stringify(decoded));
      console.log(
        "------------------------------------------Middleware Decoding JWT------------------------------"
      );
      next();
    } catch (e) {
      req.errorStatus = 401;
      next(new Error("User doesn't exist2"));
    }
  }

  static adminRole(req, res, next) {
    const user = req.user;
    console.log("-------------------User-------------------");
    console.log(user);
    console.log("-------------------User-------------------");
    if (user.type !== "user") {
      req.errorStatus = 401;
      next(new Error("You are an Unauthorised User"));
    }
    next();
  }
}
