import City from "../models/City";

export class CityController {
  static async addCity(req, res, next) {
    const path = req.file.path;
    try {
      const data = {
        banner: path,
      };
      const banner = await new City(data).save();
      res.send(banner);
    } catch (e) {
      next(e);
    }
  }

  static async getCities(req, res, next) {
    try {
      const cities = await City.find({status: true})
      res.send(cities);
    } catch (e) {
      next(e);
    }
  }
}
