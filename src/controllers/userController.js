const prisma = require("../config/db");

// 🔹 Get All Users (ADMIN only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Get Single User
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Update User Role (ADMIN only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["ADMIN", "ANALYST", "VIEWER"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
    });

    res.json({ message: "Role updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Activate / Deactivate User (ADMIN only)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status: !user.status },
    });

    res.json({
      message: `User ${updatedUser.status ? "activated" : "deactivated"}`,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};