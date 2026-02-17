import { Request, Response } from 'express';
import { prisma  } from '../utils/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, role, contact, regularPracticeLocation } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
        contact,
        regularPracticeLocation
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log(email)
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'user doesnt exists' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        contact: true,
        regularPracticeLocation: true,
        rating: true,
        contractsCreated : {
          select : {
            pickupDate : true,
            startLocation : true,
            endLocation : true,
            weight : true,
            approxKms : true,
            id  : true,
            bids : true
          }
        },
        bids : true
      }
    });
    if (!user){
      return res.json({message:"Failed to fetch the user"})
    }
    res.json(user);
  
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username, contact, regularPracticeLocation } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { username, contact, regularPracticeLocation },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        contact: true,
        regularPracticeLocation: true,
        rating: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};