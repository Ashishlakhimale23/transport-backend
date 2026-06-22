import { Request, Response } from 'express';
import { prisma} from '../utils/database';


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;

    const where: any = {};
    if (role) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        contact: true,
        regularPracticeLocation: true,
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        contact: true,
        regularPracticeLocation: true,
        contractsCreated: true,
        contractsCarried: {
          where: {
            deliveryStatus: 'DELIVERED'
          }
        },
        receivedRatings: {
          select: {
            value: true,
            comment: true,
            createdAt: true,
            rater: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const averageRating = user.receivedRatings.length > 0
      ? user.receivedRatings.reduce((sum, r) => sum + r.value, 0) / user.receivedRatings.length
      : null;

    res.json({
      ...user,
      averageRating: averageRating ? parseFloat(averageRating.toFixed(2)) : null,
      totalRatings: user.receivedRatings.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
/**
export const updateUserRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { rating },
      select: {
        id: true,
        username: true,
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rating' });
  }
};
*/

export const submitRating = async (req: Request, res: Response) => {
  try {
    const { ratedUserId, contractId, value, comment } = req.body;
    const raterId = req.user!.id;

    if (!ratedUserId || !contractId || !value) {
      return res.status(400).json({ error: 'Missing required fields: ratedUserId, contractId, value' });
    }

    if (value < 1 || value > 5) {
      return res.status(400).json({ error: 'Rating value must be between 1 and 5' });
    }

    if (comment && comment.length > 500) {
      return res.status(400).json({ error: 'Comment cannot exceed 500 characters' });
    }

    if (raterId === parseInt(ratedUserId)) {
      return res.status(400).json({ error: 'Cannot rate yourself' });
    }

    // Check if user has already rated this person for this contract
    const existingRating = await prisma.rating.findFirst({
      where: {
        raterId: raterId,
        ratedUserId: parseInt(ratedUserId),
        contractId: parseInt(contractId)
      }
    });

    if (existingRating) {
      // Update existing rating
      const updatedRating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          value,
          comment: comment || null
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Rating updated successfully',
        rating: updatedRating
      });
    }

    // Create new rating
    const newRating = await prisma.rating.create({
      data: {
        raterId: raterId,
        ratedUserId: parseInt(ratedUserId),
        contractId: parseInt(contractId),
        value,
        comment: comment || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const  userId  = req?.user?.id;
    console.log(userId)

    if (!userId || userId == undefined){
      return res.json({message:"no user id provided"})
    }

    const ratings = await prisma.rating.findMany({
      where: { ratedUserId: userId },
      include: {
        rater: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(ratings)
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
      : 0;

    res.json({
      userId: userId,
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalRatings: ratings.length,
      ratings
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};