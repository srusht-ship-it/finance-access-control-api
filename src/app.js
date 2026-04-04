const express = require("express");
const cors = require("cors");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try later",
});
app.use(cors());
app.use(express.json());
app.use(limiter);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

const recordRoutes = require("./routes/recordRoutes");

app.use("/api/records", recordRoutes);

const summaryRoutes = require("./routes/summaryRoutes");

app.use("/api/summary", summaryRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const errorHandler = require("./middleware/errorMiddleware");

app.use(errorHandler);


