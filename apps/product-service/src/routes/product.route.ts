import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { shouldBeAdmin } from "../middleware/authMiddle.js";

const router:Router = Router();
router.post("/",shouldBeAdmin, createProduct)
router.get("/:id", getProduct)
router.get("/", getProducts)
router.put("/:id",shouldBeAdmin, updateProduct)
router.delete("/:id",shouldBeAdmin, deleteProduct)
export default router;
