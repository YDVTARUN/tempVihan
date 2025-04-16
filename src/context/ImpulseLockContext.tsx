
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  PurchaseRecord, 
  UserStats, 
  SavingsGoal,
  getPurchaseRecords,
  getUserStats,
  getSavingsGoals,
  addPurchaseRecord,
  updateUserStats,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addMoneyToGoal
} from "@/lib/storage";

interface ImpulseLockContextType {
  purchaseRecords: PurchaseRecord[];
  userStats: UserStats;
  savingsGoals: SavingsGoal[];
  addPurchase: (record: Omit<PurchaseRecord, "id" | "date">) => void;
  addSavings: (goal: Omit<SavingsGoal, "id">) => void;
  updateSavings: (goal: SavingsGoal) => void;
  deleteSavings: (goalId: string) => void;
  addMoneyToSavings: (goalId: string, amount: number) => void;
}

const ImpulseLockContext = createContext<ImpulseLockContextType | undefined>(undefined);

export const useImpulseLock = () => {
  const context = useContext(ImpulseLockContext);
  if (context === undefined) {
    throw new Error("useImpulseLock must be used within an ImpulseLockProvider");
  }
  return context;
};

interface ImpulseLockProviderProps {
  children: ReactNode;
}

export const ImpulseLockProvider = ({ children }: ImpulseLockProviderProps) => {
  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalImpulsesStopped: 0,
    totalMoneySaved: 0,
    weeklyImpulsesStopped: 0,
    weeklyMoneySaved: 0,
    monthlyImpulsesStopped: 0,
    monthlyMoneySaved: 0,
  });
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    // Load initial data from localStorage
    setPurchaseRecords(getPurchaseRecords());
    setUserStats(getUserStats());
    setSavingsGoals(getSavingsGoals());
  }, []);

  const addPurchase = (record: Omit<PurchaseRecord, "id" | "date">) => {
    const newRecord: PurchaseRecord = {
      ...record,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    addPurchaseRecord(newRecord);
    setPurchaseRecords([newRecord, ...purchaseRecords]);
    
    // Update user stats if the money was saved
    if (record.wasSaved) {
      const newStats = { ...userStats };
      newStats.totalImpulsesStopped += 1;
      newStats.totalMoneySaved += record.price;
      newStats.weeklyImpulsesStopped += 1;
      newStats.weeklyMoneySaved += record.price;
      newStats.monthlyImpulsesStopped += 1;
      newStats.monthlyMoneySaved += record.price;
      
      updateUserStats(newRecord);
      setUserStats(newStats);
    }
  };

  const addSavings = (goal: Omit<SavingsGoal, "id">) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    
    addSavingsGoal(newGoal);
    setSavingsGoals([...savingsGoals, newGoal]);
  };

  const updateSavings = (goal: SavingsGoal) => {
    updateSavingsGoal(goal);
    setSavingsGoals(
      savingsGoals.map((g) => (g.id === goal.id ? goal : g))
    );
  };

  const deleteSavings = (goalId: string) => {
    deleteSavingsGoal(goalId);
    setSavingsGoals(savingsGoals.filter((g) => g.id !== goalId));
  };

  const addMoneyToSavings = (goalId: string, amount: number) => {
    addMoneyToGoal(goalId, amount);
    
    setSavingsGoals(
      savingsGoals.map((goal) => {
        if (goal.id === goalId) {
          return { ...goal, currentAmount: goal.currentAmount + amount };
        }
        return goal;
      })
    );
  };

  const value = {
    purchaseRecords,
    userStats,
    savingsGoals,
    addPurchase,
    addSavings,
    updateSavings,
    deleteSavings,
    addMoneyToSavings,
  };

  return (
    <ImpulseLockContext.Provider value={value}>
      {children}
    </ImpulseLockContext.Provider>
  );
};
