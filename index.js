import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js"; // relative path
import userRoutes from "./routes/User.js";
import productRoutes from "./routes/Product.js";
import cors from "cors"; // <-- imported

dotenv.config();

const app = express();
const port = process.env.PORT || 1000;

// Middlewares
app.use(cors()); // <-- ENABLE cross-origin requests from React frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware (optional)
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  console.log("Body:", req.body);
  next();
});

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("<h1>Hello, Welcome</h1>");
});

// Start server after DB connection
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
