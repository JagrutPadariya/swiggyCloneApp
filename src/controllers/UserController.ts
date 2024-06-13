import User from "../models/User";
import { Jwt } from "../utils/Jwt";
import { NodeMailer } from "../utils/NodeMailer";
import { Utils } from "../utils/Utils";

export class UserController {
  static async signup(req, res, next) {
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
        user_id: user._id,
        email: user.email,
      };
      const token = Jwt.jwtSign(payload);
      // console.log(token);
      res.json({
        token: token,
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

  static async verify(req, res, next) {
    const verification_token = req.body.verification_token;
    const email = req.user.email;
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

  static async resendVerificationEmail(req, res, next) {
    const email = req.user.email;
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

  static async login(req, res, next) {
    const user = req.user;
    const password = req.body.password;
    const data = {
      password,
      encrypt_password: user.password,
    };
    try {
      await Utils.comparePassword(data);
      const payload = {
        user_id: user._id,
        email: user.email,
      };
      const token = Jwt.jwtSign(payload);
      res.json({
        token: token,
        user: user,
      });
    } catch (e) {
      next(e);
    }
  }

  static async sendResetPasswordOtp(req, res, next) {
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

  static async verifyResetPasswordToken(req, res, next) {
    try {
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  static async resetPassword(req, res, next) {
    const user = req.user;
    const new_password = req.body.new_password;
    try {
      const encryptedPassword = await Utils.encryptPassword(new_password);
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: user._id,
        },
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
}
