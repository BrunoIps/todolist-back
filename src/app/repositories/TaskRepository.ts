import { Task } from "..";
import * as db from "../../database/index";

class TaskRepository {
  async create(task: Task): Promise<Task> {
    try {
      const { user_id, title, description, is_done, start_date } = task;
      const [newTask] = await db.query(
        `INSERT INTO tasks (user_id, title, description, is_done, start_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user_id, title, description, is_done, start_date]
      );
      return newTask;
    } catch (error) {
      console.error("Error occurred while creating a new task:", error);
      throw error;
    }
  }

  async findAllByUser(user_id: string, start_date?: Date): Promise<Task[]> {
    try {
      let query = `SELECT * FROM tasks WHERE user_id = $1 AND deleted_at IS NULL`;
      const params: any[] = [user_id];

      if (start_date) {
        query += ` AND DATE(start_date) = DATE($2)`;
        params.push(start_date);
      }

      const tasks = await db.query(query, params);
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
      const { title, description, is_done, start_date } = task;
      const [updatedTask] = await db.query(
        `UPDATE tasks SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         is_done = COALESCE($3, is_done),
         start_date = COALESCE($4, start_date),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 AND deleted_at IS NULL
         RETURNING *`,
        [title, description, is_done, start_date, id]
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
