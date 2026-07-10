import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as taskService from "../services/task.service";

export const createTask = async (req: AuthRequest, res: Response) =>{
    const task = await taskService.createTask(req.userId!, req.body);
    res.status(201).json(task);
};

export const getAll = async (req: AuthRequest, res: Response) =>{
    const tasks = await taskService.getTasks(req.userId!);
    res.json(tasks);
};

export const getOne = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "Task id is required" });

  const task = await taskService.getTaskById(req.userId!, id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const update = async (req: AuthRequest, res: Response) => {
  const  id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "Task id is required" });

  const task = await taskService.updateTask(req.userId!, id, req.body);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

export const remove = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "Task id is required" });

  const task = await taskService.deleteTask(req.userId!, id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Deleted successfully" });
};

