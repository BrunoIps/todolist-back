import { Task } from "..";
import * as db from "../../database/index";

class TaskRepository {
  async create(task: Task): Promise<Task> {
    try {
      const { user_id, title, description, is_done } = task;
      const [newTask] = await db.query(
        `INSERT INTO tasks (user_id, title, description, is_done)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, title, description, is_done]
      );
      return newTask;
    } catch (error) {
      console.error("Error occurred while creating a new task:", error);
      throw error;
    }
  }

  async findAllByUser(user_id: string): Promise<Task[]> {
    try {
      const tasks = await db.query(
        `SELECT * FROM tasks WHERE user_id = $1 AND deleted_at IS NULL`,
        [user_id]
      );
      return tasks;
    } catch (error) {
      console.error(
        `Error occurred while retrieving tasks for user_id ${user_id}:`,
        error
      );
      throw error;
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const [task] = await db.query(
        `SELECT * FROM tasks WHERE id = $1 AND deleted_at IS NULL`,
        [id]
      );
      return task || null;
    } catch (error) {
      console.error(
        `Error occurred while retrieving task with id ${id}:`,
        error
      );
      throw error;
    }
  }

  async update(id: string, task: Partial<Task>): Promise<Task | null> {
    try {
      const { title, description, is_done } = task;
      const [updatedTask] = await db.query(
        `UPDATE tasks SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         is_done = COALESCE($3, is_done),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 AND deleted_at IS NULL
         RETURNING *`,
        [title, description, is_done, id]
      );
      return updatedTask || null;
    } catch (error) {
      console.error(`Error occurred while updating task with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.query(
        `UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id]
      );
    } catch (error) {
      console.error(`Error occurred while deleting task with id ${id}:`, error);
      throw error;
    }
  }
}

export default new TaskRepository();
