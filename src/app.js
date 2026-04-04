const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

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