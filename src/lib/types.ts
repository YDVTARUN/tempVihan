
// Define types for the ImpulseLock application

export interface PurchaseRecord {
  id: string;
  date: string;
  productName: string;
  price: number;
  reason: string;
  wasPurchased: boolean;
  wasSaved: boolean;
  website?: string; // The website/marketplace where the purchase was attempted
}

export interface UserStats {
  totalImpulsesStopped: number;
  totalMoneySaved: number;
  weeklyImpulsesStopped: number;
  weeklyMoneySaved: number;
  monthlyImpulsesStopped: number;
  monthlyMoneySaved: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface MarketplaceConfig {
  domain: string;
  selectors: {
    productName: string;
    price: string;
    buyButton: string;
  };
}
