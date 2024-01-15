import express from "express";
import { apiGetAll, apiGet, apiCreate, apiDelete } from "../controllers/apiController.js"
const router = express.Router();

router.get("/", apiGetAll);
router.get("/:id", apiGet);
router.post("/", apiCreate);
router.delete("/:id", apiDelete);

export default router;

