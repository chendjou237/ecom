import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller.js";

const router:Router = Router();
router.post("/", createCategory)
router.get("/", getCategories)
router.put("/:id", updateCategory)
router.delete("/:id", deleteCategory)
export default router;
