import { User } from "./user";

export interface Task {
  uid: string;
  title: string;
  description: string;
  status: 'Backlog' | 'Pending' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignee: User | null;
}