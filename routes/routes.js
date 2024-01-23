import express from "express";
import { userLogout, getAllTask, getSingleTask, updateTask, userSignUp, userLogin, createTask, deleteTask, deleteCompleteTasks, tokenAuthentication, isUserLoggedIn } from "../controllers/apiController.js"
const router = express.Router();

router.get("/tasks", tokenAuthentication, getAllTask);
router.post("/register", userSignUp)
router.post("/login", userLogin)
router.get("/logout", tokenAuthentication, userLogout);
router.get("/:taskId", tokenAuthentication, getSingleTask);
router.post("/task", tokenAuthentication, createTask);
router.put("/task", tokenAuthentication, updateTask);
router.get("/userLoggedIn", isUserLoggedIn);
router.delete("/delete/complete", tokenAuthentication, deleteCompleteTasks);
router.delete("/delete", tokenAuthentication, deleteTask);

export default router;

