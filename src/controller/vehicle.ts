// src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import { prisma} from '../utils/database';
import { UserRole } from '../utils/types';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
        role: UserRole;
      };
    }
  }
}



export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { wheelers, category, brand, insuranceValidity } = req.body;

    const vehicle = await prisma.vehicleType.create({
      data: {
        wheelers,
        category,
        brand,
        insuranceValidity,
        driverId: req.user!.id
      },
      include: {
        driver: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
};

export const getMyVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicleType.findMany({
      where: { driverId: req.user!.id }
    });

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicleType.findUnique({
      where: { id: parseInt(id) },
      include: {
        driver: {
          select: {
            id: true,
            username: true,
            email: true,
            contact: true,
            rating: true
          }
        }
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { wheelers, category, brand, insuranceValidity } = req.body;

    const existingVehicle = await prisma.vehicleType.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (existingVehicle.driverId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const vehicle = await prisma.vehicleType.update({
      where: { id: parseInt(id) },
      data: {
        wheelers,
        category,
        brand,
        insuranceValidity
      }
    });

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicleType.findUnique({
      where: { id: parseInt(id) }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (vehicle.driverId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.vehicleType.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};