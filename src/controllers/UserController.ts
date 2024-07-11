import User from "../models/User";
import { Jwt } from "../utils/Jwt";
import { NodeMailer } from "../utils/NodeMailer";
import { Utils } from "../utils/Utils";
import { Request, Response, NextFunction } from "express";

export class UserController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    console.log("req: ", req);
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const name = req.body.name;
    const type = req.body.type;
    const status = req.body.status;
    const verification_token = Utils.generateVerificationToken();

    try {
      const hash = await Utils.encryptPassword(password);

      const data = {
        email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        phone,
        password: hash,
        name,
        type,
        status,
      };
      let user = await new User(data).save();
      const payload = {
        // user_id: user._id,
        // aud: user._id,
        email: user.email,
        type: user.type,
      };
      // filter user data to pass in frontend
      const access_token = Jwt.jwtSign(payload, user._id);
      const refresh_token = Jwt.jwtSignRefreshToken(payload, user._id);
      res.json({
        token: access_token,
        refreshToken: refresh_token,
        user: user,
      });
      // send email to user for verification
      await NodeMailer.sendMail({
        to: [user.email],
        subject: "Email Verification",
        html: `<h1>Your Otp is ${verification_token}</h1>`,
      });
    } catch (e) {
      next(e);
    }
  }

  static async verifyUserEmailToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const verification_token = req.body.verification_token;
    const email = (req as any).user.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        {
          email_verified: true,
          updated_at: new Date(),
        },
        {
          new: true,
        }
      );
      if (user) {
        res.send(user);
      } else {
        throw new Error(
          "Wrong Otp or Email Verification Token Is Expired. Please try again..."
        );
      }
    } catch (e) {
      next(e);
    }
  }

  static async resendVerificationEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const email = (req as any).user.email;
    const verification_token = Utils.generateVerificationToken();
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          updated_at: new Date(),
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Resend Email Verification",
          html: `<h1>Your Otp is ${verification_token}</h1>`,
        });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    const password = req.body.password;
    const data = {
      password,
      encrypt_password: user.password,
    };
    try {
      await Utils.comparePassword(data);
      const payload = {
        // user_id: user._id,
        // aud: user._id,
        email: user.email,
        type: user.type,
      };
      const access_token = Jwt.jwtSign(payload, user._id);
      const refresh_token = Jwt.jwtSignRefreshToken(payload, user._id);
      res.json({
        token: access_token,
        refreshToken: refresh_token,
        user: user,
      });
    } catch (e) {
      next(e);
    }
  }

  static async sendResetPasswordOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const email = req.query.email;
    const reset_password_token = Utils.generateVerificationToken();
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
        },
        {
          updated_at: new Date(),
          reset_password_token: reset_password_token,
          reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: "Reset Password Email Verification OTP",
          html: `<h1>Your Otp is ${reset_password_token}</h1>`,
        });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static verifyResetPasswordToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.json({ success: true });
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    const new_password = req.body.new_password;
    try {
      const encryptedPassword = await Utils.encryptPassword(new_password);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          updated_at: new Date(),
          password: encryptedPassword,
        },
        {
          new: true,
        }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async profile(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    try {
      const profile = await User.findById(user.aud);
      if (profile) {
        res.send(profile);
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (e) {
      next(e);
    }
  }

  static async updatePhoneNumber(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = (req as any).user;
    const phone = req.body.phone;
    try {
      const userData = await User.findByIdAndUpdate(
        user.aud,
        { phone: phone, updated_at: new Date() },
        { new: true }
      );
      res.send(userData);
    } catch (e) {
      next(e);
    }
  }

  static async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = (req as any).user;
    const phone = req.body.phone;
    const new_email = req.body.email;
    const plain_password = req.body.password;
    const verification_token = Utils.generateVerificationToken();
    try {
      const userData = await User.findById(user.aud);
      if (!userData) throw new Error("User doesn't exist");
      await Utils.comparePassword({
        password: plain_password,
        encrypt_password: userData.password,
      });
      const updatedUser = await User.findByIdAndUpdate(
        user.aud,
        {
          phone: phone,
          email: new_email,
          email_verified: false,
          verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
          updated_at: new Date(),
        },
        { new: true }
      );
      const payload = {
        // aud: user.aud,
        email: updatedUser.email,
        type: updatedUser.type,
      };
      const access_token = Jwt.jwtSign(payload, user.aud);
      const refresh_token = Jwt.jwtSignRefreshToken(payload, user.aud);
      res.json({
        token: access_token,
        refreshToken: refresh_token,
        user: updatedUser,
      });
      // send email to user for updated email verification
      await NodeMailer.sendMail({
        to: [updatedUser.email],
        subject: "Email Verification",
        html: `<h1>Your Otp is ${verification_token}</h1>`,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getNewToken(req, res, next) {
    const refreshToken = req.body.refreshToken;
    try {
      const decoded_data = await Jwt.jwtVerifyRefreshToken(refreshToken);
      if (decoded_data) {
        const payload = {
          // user_id: decoded_data.aud,
          email: decoded_data.email,
          type: decoded_data.type,
        };
        const access_token = Jwt.jwtSign(payload, decoded_data.aud);
        const refresh_token = Jwt.jwtSignRefreshToken(
          payload,
          decoded_data.aud
        );
        res.json({
          accessToken: access_token,
          refreshToken: refresh_token,
        });
      } else {
        req.errorStatus = 403;
        // throw new Error("Access is forbidden");
        throw "Access is forbidden";
      }
    } catch (e) {
      req.errorStatus = 403;
      next(e);
    }
  }
}
