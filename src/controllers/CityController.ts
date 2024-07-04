import City from "../models/City";
import { Request, Response, NextFunction } from "express";

export class CityController {
  static async addCity(req: Request, res: Response, next: NextFunction) {
    const name = req.body.name;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const status = req.body.status;
    try {
      const data = {
        name,
        lat,
        lng,
        status,
      };
      const city = await new City(data).save();
      res.send(city);
    } catch (e) {
      next(e);
    }
  }

  static async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const cities = await City.find({ status: "active" });
      res.send(cities);
    } catch (e) {
      next(e);
    }
  }
}
