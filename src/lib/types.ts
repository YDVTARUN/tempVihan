
// Define types for the ImpulseLock application

export interface PurchaseRecord {
  id: string;
  date: string;
  productName: string;
  price: number;
  reason: string;
  wasPurchased: boolean;
  wasSaved: boolean;
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
