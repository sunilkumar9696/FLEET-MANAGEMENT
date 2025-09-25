import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../config/mailConfig.js';
import crypto from 'crypto';

export const register = async (req, res) => {
  try {
    let { name, email, phoneNumber, password, role } = req.body;
  
    console.log("register triggered");
    console.log('Incoming register payload:', req.body);

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "Name, email, phoneNumber and password are mandatory." });
    }

    email = email.toLowerCase(); // normalize email

    // Check for existing user by email or phoneNumber
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });
    if (existingUser) {
      return res.status(400).json({ message: "User with given email or phone number already exists." });
    }

    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role,
    });

    // Don't send password in response
    const userSafe = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role
    };

    res.status(201).json({ message: "User registered successfully", user: userSafe });
  } catch (error) {
    console.error("Register Error:", error);

    // Handle duplicate key error explicitly
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `Duplicate ${field} entered` });
    }

    res.status(500).json({ error: "Server error. Please try again." });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are mandatory." });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Include role in JWT payload to be used in auth middleware
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", accessToken: token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

export const logout = async (req, res) => {
  try {
    // This clears the cookie named "token"
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/resetpassword/${resetToken}`;

    const message = `
      <p>You requested a password reset</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>This link expires in 10 minutes.</p>
    `;

    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({ message: "Reset email sent", resetUrl });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Email failed to send" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Token is invalid or expired" });
    }

    user.password = password; // will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(201).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.status(200).json({ users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      return res.status(400).json({ message: "Password cannot be updated here" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ success: true, message: "User updated", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};