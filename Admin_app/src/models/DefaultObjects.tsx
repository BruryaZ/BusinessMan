import { BusinessDto } from "./BusinessDto";
import { User } from "./User";

export const defaultBusiness: BusinessDto = {
  id: 0,
  businessId: 0,
  name: '',
  address: '',
  email: '',
  businessType: '',
  income: 0,
  expenses: 0,
  cashFlow: 0,
  totalAssets: 0,
  totalLiabilities: 0,
  netWorth: 0,
  revenueGrowthRate: 0,
  profitMargin: 0,
  currentRatio: 0,
  quickRatio: 0,
  createdBy: '',
  updatedBy: '',
  usersCount: 0,
  createdAt: "",
  updatedAt: ""
};

export const defaultUser: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 0,
    idNumber: '',
    status: 'inactive',
    lastLogin: new Date(),
    createdAt: new Date(),
    createdBy: '',
    updatedAt: new Date(),
    updatedBy: '',
    businessId: null,
    business: null,
    invoices: [],
  };