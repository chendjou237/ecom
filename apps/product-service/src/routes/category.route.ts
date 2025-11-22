import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddle.js";

const router:Router = Router();
router.post("/",shouldBeAdmin, createCategory)
router.get("/", getCategories)
router.put("/:id",shouldBeAdmin, updateCategory)
router.delete("/:id",shouldBeAdmin, deleteCategory)
export default router;
