import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const admin_email = process.env.ADMIN_EMAIL

export const register = async (req: Request, res: Response) => {
  try {
    const { upiID,email, username, password, role, contact, regularPracticeLocation } = req.body;
    if (role == "admin" && email != admin_email) {
      return res.status(500).json({ error: 'Invalid admin email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user
    if (role == "admin") {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          username: "",
          contact: "9561568505",
          regularPracticeLocation: ""
        },
        select: {
          id: true,
          email: true,
          role: true
        }
      });

    } else {
      user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role,
          contact,
          regularPracticeLocation,
          upiID

        },
        select: {
          id: true,
          email: true,
          username: true,
          role: true
        }
      });
    }



    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
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
    const { email, password, role } = req.body;

    if (role == "admin" && email != admin_email) {
      res.status(500).json({ error: 'Invalid admin email' });
    }

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
      contractsCreated: {
        select: {
          pickupDate: true,
          startLocation: true,
          endLocation: true,
          weight: true,
          deliveryStatus:true,
          goodsCarrier:true,
          approxKms: true,
          id: true,
          type: true,
          bids: {
            select: {
              user: true,
              status: true,
              amount: true,
              createdAt: true,

            }
          },
          winningPrice: true
        }
      },
      bids: {
        select: {
          status: true,
          id: true,
          contractId: true,
          contract: {
            select: {
              startLocation: true,
              endLocation: true,
              type: true,
              typeOfVehicle: true,
            }
          },
          amount: true,
          createdAt: true
        }
      }
    }
  });
  if (!user) {
    return res.json({ message: "Failed to fetch the user" })
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
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};