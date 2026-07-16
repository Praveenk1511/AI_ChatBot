import jwt from "jsonwebtoken";
import User from "../models/User.js";

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function sendTokenResponse(user, statusCode, res) {
  const token = generateToken(user._id);

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

// Register
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed." });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed." });
  }
}

// Logout
export function logout(req, res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully." });
}

// Get current user
export function getMe(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
}
