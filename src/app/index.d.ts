export interface User {
  email: string;
  password: string;
  name: string;
  id?: string;
}

export interface Error {
  message: string;
  status: number;
}

interface Task {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  is_done: boolean;
  start_date: Date;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
