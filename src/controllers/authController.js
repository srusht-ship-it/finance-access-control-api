const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    if(!user){
      throw new AppError("User not found", 404);
    }
    
    if (!email.includes("@")) {
  return res.status(400).json({
    success: false,
    message: "Invalid email format",
  });
}

if (password.length < 6) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 6 characters",
  });
}
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    role,
  },
});

// remove password
const { password: _, ...safeUser } = user;

res.status(201).json({
  success: true,
  message: "User registered successfully",
  data: safeUser,
});

    // Remove password from response
    delete user.password;

    res.status(201).json({
      success:true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

// Check if user is inactive
if (!user.status) {
  return res.status(403).json({ message: "User is inactive. Contact admin." });
}
   if (!email.includes("@")) {
  return res.status(400).json({ success: false, message: "Invalid email format" });
}

if (password.length < 6) {
  return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
}
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    
    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success:true,
      message: "Login successful",
      data:{token},
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};