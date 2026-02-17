export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export enum UserRole {

  ADMIN = 'admin',
  CONTRACTOR = 'contractor',
  DRIVER = 'driver'
}

export enum VehicleWheel {
  V4 = '4',
  V6 = '6',
  V10 = '10',
  V12 = '12'
}

export enum GoodsType {
  HANDLE_WITH_CARE = 'handlewithcare',
  AUTOMOBILE = 'automobile'
}

export enum VehicleCategory {
  OPEN = 'open',
  SEMIOPEN = 'semiopen',
  CONTAINER = 'container'
}

export enum InsuranceType {
  BASIC = 'basic',
  PRO = 'pro',
  MAXSAVER = 'maxsaver'
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  password: string;
  contact: number;
  regularPracticeLocation: string;
  rating?: number;
}

export interface Contract {
  id: number;
  weight: number;
  pickupDate: Date;
  dropDate: Date;
  startLocation: string;
  endLocation: string;
  approxKms: number;
  contractorId: number;
  goodsCarrierId?: number;
  typeOfVehicle: VehicleWheel;
  insured: boolean;
  winningPrice?: number;
  type: GoodsType;
  createdAt: Date;
  requirements : string[];
  description : string
}

export interface Bid {
  id: number;
  userId: number;
  contractId: number;
  amount: number;
}

export interface VehicleType {
  id: number;
  wheelers: VehicleWheel;
  category: VehicleCategory;
  brand: string;
  insuranceValidity: boolean;
}

export interface Insurance {
  id: number;
  contractId: number;
  type: InsuranceType;
  premium: number;
}