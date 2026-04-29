# Transport Management System

A modern web application for managing goods transportation contracts and connecting contractors with drivers through a bidding system.

## Overview

Transport is a TypeScript-based backend system that streamlines the logistics industry by providing:

- **Contract Management**: Contractors can post transportation contracts with specific requirements
- **Bidding System**: Drivers can bid on available contracts
- **User Roles**: Support for administrators, contractors, and drivers with role-based access
- **Rating System**: Users can rate each other based on completed contracts
- **Vehicle Management**: Drivers can manage their vehicle information
- **Authentication**: Secure JWT-based authentication with email verification

## Tech Stack

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Security**: 
  - JWT for authentication
  - bcryptjs for password hashing
  - Helmet for HTTP header security
  - CORS support
- **Email**: Nodemailer for email notifications
- **Validation**: express-validator for input validation

## Project Structure

```
├── src/
│   ├── main.ts                 # Entry point
│   ├── controller/             # Business logic
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── contract.ts
│   │   ├── bid.ts
│   │   └── vehicle.ts
│   ├── routes/                 # API endpoints
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── contract.ts
│   │   ├── bid.ts
│   │   └── vechile.ts
│   ├── middleware/             # Express middleware
│   │   ├── auth.ts             # JWT verification
│   │   ├── validation.ts       # Input validation
│   │   └── error.ts            # Error handling
│   ├── utils/
│   │   ├── database.ts
│   │   ├── email.ts
│   │   └── types.ts
│   └── generate/prisma/        # Prisma generated types
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── dist/                       # Compiled JavaScript
└── package.json
```

## Database Schema

### Users
- id, email, username, password, contact, role (admin, contractor, driver)
- Manages multiple vehicles and contracts

### Contracts
- Transportation contracts with pickup/drop locations, weight, dates
- Linked to contractor and goods carrier
- Includes delivery status and requirements

### Bids
- Drivers submit bids on contracts
- Tracks amount, status, and creation date

### Vehicles
- Driver vehicle information (wheels, category, brand)
- Categories: open, semi-open, container

### Ratings
- User-to-user ratings after contract completion
- Unique constraint: one rating per user per contract

### Enums
- **UserRole**: admin, contractor, driver
- **VehicleWheel**: 4, 6, 10, 12 wheelers
- **GoodsType**: handle with care, automobile
- **VehicleCategory**: open, semi-open, container
- **DeliveryStatus**: in transit, delivered, completed

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd transport-ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/transport_db
   PORT=3000
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start with hot-reload enabled on `http://localhost:3000`

### Production Mode
```bash
# Build TypeScript to JavaScript
npm run build

# Start the server
npm start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio UI for database exploration |

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/verify-email` - Verify email address

### Users (`/api/users`)
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/ratings` - Get user ratings

### Contracts (`/api/contracts`)
- `POST /api/contracts` - Create new contract (contractors only)
- `GET /api/contracts` - List all contracts
- `GET /api/contracts/:id` - Get contract details
- `PUT /api/contracts/:id` - Update contract (contractor only)
- `GET /api/contracts/:id/bids` - Get all bids for a contract

### Bids (`/api/bids`)
- `POST /api/bids` - Submit a bid on a contract (drivers only)
- `GET /api/bids/:id` - Get bid details
- `PUT /api/bids/:id` - Update bid status

### Vehicles (`/api/vehicles`)
- `POST /api/vehicles` - Add new vehicle
- `GET /api/vehicles` - List user's vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

## User Roles

### Admin
- Manage platform, approve contracts, handle disputes

### Contractor
- Post transportation contracts
- Accept bids from drivers
- Rate drivers after delivery

### Driver
- Manage vehicle information
- Bid on available contracts
- Accept contract offers
- Rate contractors

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation with express-validator
- CORS protection
- Helmet.js for HTTP security headers
- Role-based access control

## Error Handling

The application includes comprehensive error handling with:
- Centralized error middleware
- Validation error responses
- Database error handling
- JWT verification errors

## Database Migrations

Migrations are version-controlled in `prisma/migrations/`. When schema changes are made:

```bash
# Create a new migration
npm run prisma:migrate

# Rollback to previous state
npx prisma migrate resolve --rolled-back <migration-name>
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (default: 3000) |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | JWT expiration time (e.g., "7d") |
| `EMAIL_USER` | Email address for notifications |
| `EMAIL_PASSWORD` | Email app password |

## Troubleshooting

**Connection Error**
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env`

**Prisma Client Generation Error**
```bash
npm run prisma:generate
```

**Port Already in Use**
- Change `PORT` in `.env`
- Or kill process: `kill -9 $(lsof -ti:3000)`

