import express from "express";
import { apiGetAll, apiCreate, apiGet, apiDelete } from "../controllers/apiController.js"
const router = express.Router();

router.get("/", apiGetAll);
router.get("/get/:id", apiGet);
router.post("/", apiCreate);
router.delete("/:id", apiDelete);

export default router;

