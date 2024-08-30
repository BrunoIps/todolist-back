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

export interface Task {
  title: string;
  description: string;
  is_done: boolean;
  user_id: string;
  taskId?: string;
  deletedAt?: Date;
  createdAt?: Date;
}
