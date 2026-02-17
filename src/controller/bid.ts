import { Request, Response } from 'express';
import { prisma } from '../utils/database';


export const createBid = async (req: Request, res: Response) => {
  try {
    const { contractId, amount } = req.body;

    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (contract.contractorId === req.user!.id) {
      return res.status(400).json({ error: 'Cannot bid on your own contract' });
    }

    if (contract.goodsCarrierId) {
      return res.status(400).json({ error: 'Contract already assigned' });
    }

    const existingBid = await prisma.bid.findFirst({
      where: {
        contractId,
        userId: req.user!.id
      }
    });

    if (existingBid) {
      return res.status(400).json({ error: 'You have already bid on this contract' });
    }

    const bid = await prisma.bid.create({
      data: {
        userId: req.user!.id,
        contractId,
        amount
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            rating: true
          }
        },
        contract: true
      }
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bid' });
  }
};

export const getBidsByContract = async (req: Request, res: Response) => {
  try {
    const { contractId } = req.params;

    const bids = await prisma.bid.findMany({
      where: { contractId: parseInt(contractId) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            rating: true,
            contact: true
          }
        }
      },
      orderBy: { amount: 'asc' }
    });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
};

export const getMyBids = async (req: Request, res: Response) => {
  try {
    const bids = await prisma.bid.findMany({
      where: { userId: req.user!.id },
      include: {
        contract: {
          include: {
            contractor: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bids' });
  }
};

export const updateBid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const existingBid = await prisma.bid.findUnique({
      where: { id: parseInt(id) },
      include: { contract: true }
    });

    if (!existingBid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (existingBid.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (existingBid.contract.goodsCarrierId) {
      return res.status(400).json({ error: 'Contract already assigned' });
    }

    const bid = await prisma.bid.update({
      where: { id: parseInt(id) },
      data: { amount },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            rating: true
          }
        }
      }
    });

    res.json(bid);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bid' });
  }
};

export const deleteBid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bid = await prisma.bid.findUnique({
      where: { id: parseInt(id) },
      include: { contract: true }
    });

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (bid.userId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (bid.contract.goodsCarrierId) {
      return res.status(400).json({ error: 'Cannot delete bid on assigned contract' });
    }

    await prisma.bid.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bid' });
  }
};