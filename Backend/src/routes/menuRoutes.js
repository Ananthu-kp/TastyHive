import express from "express";
import menuController from "../controller/menuController.js";

const router = express.Router();

router.post("/add", menuController.addMenuItem); 
router.get("/", menuController.getMenuItems);
router.put("/:id", menuController.updateMenuItem);
router.delete("/:id", menuController.deleteMenuItem);

export default router;
