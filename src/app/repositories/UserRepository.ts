import { User } from "..";
import bcrypt from "bcrypt";
import * as db from "../../database/index";

class UserRepository {
  async findAll() {
    try {
      const rows: User[] = await db.query("SELECT * FROM users");
      return rows;
    } catch (error) {
      console.error("Error occurred while finding all users:", error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const [row] = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      return row;
    } catch (error) {
      console.error(`Error occurred while finding user with id ${id}:`, error);
      throw error;
    }
  }
  async findByEmail(email: string) {
    try {
      const [row] = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return row;
    } catch (error) {
      console.error(
        `Error occurred while finding user with id ${email}:`,
        error
      );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const [row] = await db.query(
        "UPDATE users SET deleted_at = NOW() WHERE id = $1 RETURNING *",
        [id]
      );
      return row as User;
    } catch (err) {
      console.error(`Error occurred while deleting user with id ${id}:`, err);
      throw err;
    }
  }

  async create({ email, name, password }: User) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [row] = await db.query(
        "INSERT INTO users(email, name, password) VALUES($1, $2, $3) RETURNING *",
        [email, name, hashedPassword]
      );
      return row as User;
    } catch (err) {
      console.error("Error occurred while creating a new user:", err);
      throw err;
    }
  }
  async update(id: string, { email, name, password }: User) {
    try {
      const [row] = await db.query(
        "UPDATE users SET email = $1, name = $2, password = $3 WHERE id = $4 RETURNING *",
        [email, name, password, id]
      );
      return row as User;
    } catch (err) {
      console.error(`Error occurred while updating user with id ${id}:`, err);
      throw err;
    }
  }
  async updatePassword(id: string, password: string) {
    try {
      const [row] = await db.query(
        "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
        [password, id]
      );
      return row as User;
    } catch (err) {
      console.error(`Error occurred while updating user with id ${id}:`, err);
      throw err;
    }
  }
}

export default new UserRepository();
