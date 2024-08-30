import { Router } from "express";
import userController from "./app/controllers/userController";
import authController from "./app/controllers/authController";

const router = Router();

router.get("/users", userController.index);
router.post("/auth/register", userController.store);
router.post("/auth", authController.login);

export default router;
