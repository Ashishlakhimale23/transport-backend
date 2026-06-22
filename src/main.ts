import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth';
import contractRoutes from './routes/contract';
import bidRoutes from './routes/bid';
import vehicleRoutes from './routes/vechile';
import userRoutes from './routes/user';
import { errorHandler } from './middleware/error';

const app = express();

app.use(helmet());
app.use(cors({ origin: ['*',"http://localhost:3000"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});