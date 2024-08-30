import { Request, Response, NextFunction } from "express";
import taskRepository from "../repositories/TaskRepository";
import { Task } from "..";

class TaskController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, title, description, is_done }: Task = req.body;
      const newTask = await taskRepository.create({
        user_id,
        title,
        description,
        is_done,
      });
      res.status(201).json(newTask);
    } catch (err) {
      next(err);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const tasks = await taskRepository.findAllByUser(user_id);
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
        return res.status(404).json({ message: "Task not found" });
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
