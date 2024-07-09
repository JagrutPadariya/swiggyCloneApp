import Address from "../models/Address";
import { Request, Response, NextFunction } from "express";

export class AddressController {
  static async addAddress(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const user_id = (req as any).user.aud;
    try {
      const addressData = {
        user_id,
        title: data.title,
        address: data.address,
        landmark: data.landmark,
        house: data.house,
        lat: data.lat,
        lng: data.lng,
      };
      const address = await new Address(addressData).save();
      const response_address = {
        title: address.title,
        address: address.address,
        landmark: address.landmark,
        house: address.house,
        lat: address.lat,
        lng: address.lng,
        created_at: address.created_at,
        updated_at: address.updated_at,
      };
      res.send(response_address);
    } catch (e) {
      next(e);
    }
  }

  static async getUserAddresses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user_id = (req as any).user.aud;
    try {
      const addresses = await Address.find({ user_id }, { user_id: 0, __v: 0 });
      res.send(addresses);
    } catch (e) {
      next(e);
    }
  }

  static async getUserLimitedAddresses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user_id = (req as any).user.aud;
    const limit = (req as any).query.limit;
    try {
      const addresses = await Address.find(
        { user_id },
        { user_id: 0, __v: 0 }
      ).limit(limit);
      res.send(addresses);
    } catch (e) {
      next(e);
    }
  }

  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    const user_id = (req as any).user.aud;
    const id = req.params.id;
    try {
      await Address.findOneAndDelete({
        user_id: user_id,
        _id: id,
      });
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  static async getAddressById(req: Request, res: Response, next: NextFunction) {
    const user_id = (req as any).user.aud;
    const id = req.params.id;
    try {
      const address = await Address.findOne(
        {
          user_id: user_id,
          _id: id,
        },
        { user_id: 0, __v: 0 }
      );
      res.send(address);
    } catch (e) {
      next(e);
    }
  }

  static async editAddress(req: Request, res: Response, next: NextFunction) {
    const user_id = (req as any).user.aud;
    const id = req.params.id;
    const data = req.body;
    try {
      const address = await Address.findOneAndUpdate(
        {
          user_id: user_id,
          _id: id,
        },
        {
          title: data.title,
          address: data.address,
          landmark: data.landmark,
          house: data.house,
          lat: data.lat,
          lng: data.lng,
          updated_at: new Date(),
        },
        { new: true, projection: { user_id: 0, __v: 0 } }
      );
      if (address) {
        res.send(address);
      } else {
        // throw new Error('Address doesn\'t exist');
        throw "Address doesn't exist";
      }
    } catch (e) {
      next(e);
    }
  }

  static async checkAddress(req: Request, res: Response, next: NextFunction) {
    const user_id = (req as any).user.aud;
    const data = req.query;
    try {
      const address = await Address.findOne(
        { user_id, lat: data.lat, lng: data.lng },
        { user_id: 0, __v: 0 }
      );
      res.send(address);
    } catch (e) {
      next(e);
    }
  }
}
