import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controllers/product.controller.js";

const router:Router = Router();
router.post("/", createProduct)
router.get("/:id", getProduct)
router.get("/", getProducts)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)
export default router;
