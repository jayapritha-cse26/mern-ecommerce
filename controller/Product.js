import { Product } from "../modules/Product.js";
import fs from "fs/promises";
import path from "path";


// Add new Product
export const createProduct = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("Files:", req.file);

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { title, description, category, price, stock } = req.body;
    const image = req.file;

    if (!title || !description || !category || !price || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Please select an image" });
    }

    const product = await Product.create({
      title,
      description,
      category,
      price,
      stock,
      image: image.path,
    });

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetch all products
// Controller: fetch all products with pagination, sorting, and optional filtering
export const fetchAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, minPrice, maxPrice } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Base query
    let productsQuery = Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Sorting
    if (sort === "price_asc") productsQuery = productsQuery.sort({ price: 1 });
    if (sort === "price_desc") productsQuery = productsQuery.sort({ price: -1 });
    if (sort === "newest") productsQuery = productsQuery.sort({ createdAt: -1 });

    const products = await productsQuery;

    res.status(200).json({ message: "Filtered & Sorted Products", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fetch single product
export const fetchSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product details", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      try {
        await fs.unlink(product.image);
        console.log("Image deleted successfully");
      } catch (err) {
        console.log("Failed to delete image:", err.message);
      }
    }

    await product.deleteOne();
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// update product details 
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields
    const { title, description, price, stock, category } = req.body;
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    // If a new image is uploaded, replace old one
    if (req.file) {
      // Delete old image file if it exists
      try {
        if (product.image) {
          const imagePath = path.resolve(product.image);
          await fs.access(imagePath); // check if file exists
          await fs.unlink(imagePath); // delete the file
        }
      } catch {
        // file does not exist, do nothing
      }

      product.image = req.file.path;
    }

    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch filtered products
export const fetchFilteredProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, keyword } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (keyword) filter.title = { $regex: keyword, $options: "i" };

    const products = await Product.find(filter);
    res.status(200).json({ message: "Filtered Products", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Search products by title
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // Get search keyword from query string

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      title: { $regex: query, $options: "i" } // Case-insensitive search
    });

    return res.status(200).json({
      message: "Search results",
      products
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Fetch products with pagination
export const fetchProductsPaginated = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;  // default page 1
    limit = parseInt(limit) || 10; // default 10 items per page
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      message: "Paginated Products",
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// fetch the product advance way

export const fetchProductsAdvanced = async (req, res) => {
  try {
    let { page, limit, category, minPrice, maxPrice, search, sort } = req.query;

    // Pagination defaults
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Build query object
    let query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (search) query.title = { $regex: search, $options: "i" };

    // Sorting
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    else if (sort === "price_desc") sortOption.price = -1;
    else sortOption.createdAt = -1; // default: newest first

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    return res.status(200).json({
      message: "Filtered & Sorted Products",
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


