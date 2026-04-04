const express = require("express");
const router = express.Router();

const recordController = require("../controllers/recordController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.post("/", authMiddleware, roleMiddleware("ADMIN"), recordController.createRecord);

router.get("/", authMiddleware, roleMiddleware(["ADMIN", "ANALYST"]), recordController.getRecords);

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), recordController.updateRecord);

router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), recordController.deleteRecord);

module.exports = router;