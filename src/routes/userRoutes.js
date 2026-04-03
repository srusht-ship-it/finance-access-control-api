const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.get("/", authMiddleware, roleMiddleware("ADMIN"), userController.getAllUsers);

router.get("/:id", authMiddleware, roleMiddleware("ADMIN"), userController.getUserById);

router.put("/:id/role", authMiddleware, roleMiddleware("ADMIN"), userController.updateUserRole);

router.put("/:id/status", authMiddleware, roleMiddleware("ADMIN"), userController.toggleUserStatus);

module.exports = router;