import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadFiles } from "../middleware/multer.js"; 

import {
  createProduct,
  fetchAllProducts,
  fetchSingleProduct,
  deleteProduct,
  updateProduct,
  fetchFilteredProducts,
  searchProducts,
  fetchProductsPaginated,
  fetchProductsAdvanced,
} from "../controller/Product.js";

const router = express.Router();

// Keep your desired URL
router.post("/User/product/new", authMiddleware, uploadFiles, createProduct);
router.get("/User/product/all-products", fetchAllProducts);
router.get("/User/product/single/:id", fetchSingleProduct);
router.delete("/User/product/:id", authMiddleware, deleteProduct);
router.put("/User/product/:id", authMiddleware,uploadFiles,updateProduct ); // allow image upload
router.get("/User/product/search", fetchFilteredProducts);
router.get("/User/product/search", searchProducts);
router.get("/User/product/paginated", fetchProductsPaginated);
router.get("/User/product/advanced", fetchProductsAdvanced);





export default router;
