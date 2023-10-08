export interface TodoInfo {
  title: string;
  text: string;
  isCompleted: boolean;
  id: number;
}

export interface VerifyToken {
  id: number;
}

export interface SendTodo {
  id: number;
  sendTo: number;
}
