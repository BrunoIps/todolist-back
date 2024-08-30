import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await UserRepository.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET ?? "default_secret",
        {
          expiresIn: "5h",
        }
      );

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await UserRepository.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate reset token and send email (implement email service)
      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "default_secret",
        {
          expiresIn: "15m",
        }
      );

      // send resetToken to user email

      res.json({ message: "Reset password email sent" });
    } catch (err) {
      next(err);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { resetToken, newPassword } = req.body;

      const payload = jwt.verify(
        resetToken,
        process.env.JWT_SECRET ?? "default_secret"
      ) as { id: string } | undefined;
      if (!payload) {
        throw new Error("Invalid token");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await UserRepository.updatePassword(payload.id, hashedPassword);

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
