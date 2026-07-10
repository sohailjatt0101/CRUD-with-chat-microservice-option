import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as taskController from "../controllers/task.controller";

const router = Router();

router. use(authenticate);

router.post("/", taskController.createTask);
router.get("/", taskController.getAll);
router.get("/:id", taskController.getOne);
router.put("/:id", taskController.update);
router.delete("/:id", taskController.remove);


export default router;

