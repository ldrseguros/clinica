import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_JWT_SECRET_KEY_HERE_PLEASE_REPLACE_AND_MOVE_TO_ENV";

/**
 * @route   POST /api/auth/register
 * @desc    Registers a new user.
 * @access  Public
 *
 * @param   {string} name - User's name (required).
 * @param   {string} email - User's email address (required, unique).
 * @param   {string} password - User's password (required, min 6 characters).
 *
 * @returns {object} 201 - User object (excluding password).
 * @returns {Error}  400 - Bad Request (e.g., missing fields, invalid email, password too short).
 * @returns {Error}  409 - Conflict (email already exists).
 * @returns {Error}  500 - Internal Server Error.
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Basic Input Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check for Existing User
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create User
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return Success Response (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
        return res.status(500).json({ message: 'Internal server error during registration.', details: error.message });
    }
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Logs in an existing user.
 * @access  Public
 *
 * @param   {string} email - User's email address (required).
 * @param   {string} password - User's password (required).
 *
 * @returns {object} 200 - JWT token.
 * @returns {Error}  400 - Bad Request (e.g., missing fields).
 * @returns {Error}  401 - Unauthorized (invalid credentials or user not found).
 * @returns {Error}  500 - Internal Server Error.
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic Input Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare Passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const tokenPayload = { userId: user.id };
    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return Success Response with JWT and user details
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
        return res.status(500).json({ message: 'Internal server error during login.', details: error.message });
    }
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

export default router;
