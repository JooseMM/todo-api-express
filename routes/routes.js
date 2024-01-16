import express from "express";
import { apiGetAll, apiCreate, apiDelete } from "../controllers/apiController.js"
const router = express.Router();

router.get("/", apiGetAll);
//router.get("/", apiGet);
router.post("/", apiCreate);
router.delete("/", apiDelete);

export default router;

