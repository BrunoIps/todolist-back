import { Router } from "express";
import userController from "./app/controllers/userController";
import authController from "./app/controllers/authController";
import { authenticateJWT } from "./app/middleware/Authentication";
import taskController from "./app/controllers/taskController";

const router = Router();

router.get("/users", userController.index);
router.post("/auth/register", userController.store);
router.post("/auth", authController.login);
router.post("/me", authenticateJWT, userController.getMe);
router.post("/task", authenticateJWT, taskController.create);
router.put("/task/:id", authenticateJWT, taskController.update);
router.delete("/task/:id", authenticateJWT, taskController.delete);
router.get("/task/:user_id", authenticateJWT, taskController.index);

export default router;
