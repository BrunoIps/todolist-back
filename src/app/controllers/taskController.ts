import { Request, Response, NextFunction } from "express";
import taskRepository from "../repositories/TaskRepository";
import { Task } from "..";
import { CustomError } from "../utils/customError";

class TaskController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, title, description, is_done, start_date }: Task =
        req.body;

      console.log(user_id, title, description, is_done, start_date);
      if (!start_date) {
        return next(new CustomError(400, "Start date is required."));
      }

      const newTask = await taskRepository.create({
        user_id,
        title,
        description,
        is_done,
        start_date,
      });
      res.status(201).json(newTask);
    } catch (err) {
      next(err);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const { start_date } = req.query;

      console.log(user_id, start_date);

      const tasks = await taskRepository.findAllByUser(
        user_id,
        start_date ? new Date(start_date as string) : undefined
      );
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const task = await taskRepository.findById(id);
      if (!task) {
        return next(new CustomError(404, "Task not found."));
      }
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const taskData: Partial<Task> = req.body;
      const updatedTask = await taskRepository.update(id, taskData);
      if (!updatedTask) {
        return res
          .status(404)
          .json({ message: "Task not found or already deleted" });
      }
      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const task = await taskRepository.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      await taskRepository.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new TaskController();
