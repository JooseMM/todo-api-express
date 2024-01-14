import express from "express";
import { apiGetAll, apiGet, apiCreate, apiDelete } from "../controllers/apiController.js"
const router = express.Router();

router.get("/", apiGetAll);
router.get("/:id", apiGet);
router.post("/", apiCreate);
router.delete("/:id", apiDelete);

export default router;

//test from terminal
//getAll: curl http://localhost:3000/
//post: curl --data "task=Clean the house!!" http://localhost:3000/
//delete: curl -X DELETE  http://localhost:3000/id
