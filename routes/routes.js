import express from "express";
import { getAllTask, getSingleTask, updateTask, userSignUp, userLogin, createTask, deleteTask, deleteCompleteTasks } from "../controllers/apiController.js"
const router = express.Router();

//implement middlewares to authenticate tokens
//and protect some endpoints
router.get("/tasks/:userId", getAllTask);
router.post("/register", userSignUp)
router.post("/login", userLogin)
//do a route for logout
router.get("/:userId/:taskId", getSingleTask);
router.post("/task", createTask);
router.put("/task", updateTask);
router.delete("/delete/complete", deleteCompleteTasks);
router.delete("/delete", deleteTask);

export default router;

