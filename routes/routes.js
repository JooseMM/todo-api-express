import express from "express";
import { apiGetAll, apiGet, apiCreate, apiDelete } from "../controllers/apiController.js"
const router = express.Router();

router.get("/get-all", apiGetAll);
router.get("/", apiGet);
router.post("/", apiCreate);
router.delete("/", apiDelete);

export default router;

