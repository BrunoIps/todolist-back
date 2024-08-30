import { Client, QueryResult } from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  host: process.env.PGHOST,
  port: 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

async function createTable() {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await Promise.all([
      client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR (255) NOT NULL,
          recoveryCode VARCHAR(255),
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP DEFAULT NULL
        );
      `),
      client.query(`
        CREATE TABLE IF NOT EXISTS tasks(
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          is_done BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `),
    ]);
  } catch (err) {
    console.error("Erro ao criar as tabelas", err);
  }
}

client.connect((err) => {
  if (err) {
    console.error("Falha na conexão com o banco de dados", err.stack);
  } else {
    console.log("Conectado ao banco de dados");
    createTable();
  }
});

export const query = async (query: string, values?: any[]): Promise<any[]> => {
  const { rows }: QueryResult = await client.query(query, values);
  return rows;
};
