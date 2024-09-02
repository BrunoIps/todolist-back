import { Request, Response, NextFunction } from "express";
import { User } from "..";
import userRepository from "../repositories/UserRepository";
import { CustomError } from "../utils/customError";
import TaskRepository from "../repositories/TaskRepository";

class UserController {
  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password }: User = req.body;

      const newEmail = email?.toLowerCase();

      if (!email || !name || !password) {
        return next(new CustomError(400, "Missing parameters"));
      }

      const emailAlreadyUsed = await userRepository.findByEmail(newEmail);

      if (emailAlreadyUsed) {
        return next(new CustomError(400, "Email already used"));
      }

      const newUser: User = await userRepository.create({
        email: newEmail,
        name,
        password,
      });
      res.json(newUser);
    } catch (err) {
      const error = err as Error;
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const users: User[] = await userRepository.findAll();
      res.json(users);
    } catch (err: unknown) {
      const error = err as Error;
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password }: User = req.body;
      const { id } = req.params;
      const user = await userRepository.findById(id);
      const emailAlreadyUsed = await userRepository.findByEmail(email);

      if (!user) {
        next(new CustomError(400, "User not found"));
      }
      if (emailAlreadyUsed) {
        next(new CustomError(400, "Email already used"));
      }

      const updatedUser = await userRepository.update(id, {
        email,
        name,
        password,
      });
      res.json(updatedUser);
    } catch (err) {
      const error = err as Error;
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await userRepository.delete(id);
      res.status(204).send();
    } catch (err) {
      const error = err as Error;
      next(error);
    }
  }

  async byId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user: User = await userRepository.findById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, date } = req.body;

      const user = await userRepository.findById(userId);
      if (!user) {
        throw new CustomError(404, "User not found");
      }

      const { password, ...userWithoutPassword } = user;

      const tasks = await TaskRepository.findAllByUser(
        userId,
        date ? new Date(date) : undefined
      );

      res.json({ user: { ...userWithoutPassword, tasks: tasks } });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
