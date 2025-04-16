
import { PurchaseRecord, UserStats, SavingsGoal } from './types';

// Export all storage functions and types for easier imports
export * from './types';

// LocalStorage keys
const PURCHASE_RECORDS_KEY = 'impulselock-purchase-records';
const USER_STATS_KEY = 'impulselock-user-stats';
const SAVINGS_GOALS_KEY = 'impulselock-savings-goals';

// Initial state for user stats
const initialUserStats: UserStats = {
  totalImpulsesStopped: 0,
  totalMoneySaved: 0,
  weeklyImpulsesStopped: 0,
  weeklyMoneySaved: 0,
  monthlyImpulsesStopped: 0,
  monthlyMoneySaved: 0,
};

// Detect if we're running in extension context
const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

// Get purchase records
export const getPurchaseRecords = (): PurchaseRecord[] => {
  if (isExtension && chrome.storage) {
    // For synchronous use in extension, fall back to localStorage
    const records = localStorage.getItem(PURCHASE_RECORDS_KEY);
    return records ? JSON.parse(records) : [];
  } else {
    const records = localStorage.getItem(PURCHASE_RECORDS_KEY);
    return records ? JSON.parse(records) : [];
  }
};

// Save purchase records
export const savePurchaseRecords = (records: PurchaseRecord[]): void => {
  localStorage.setItem(PURCHASE_RECORDS_KEY, JSON.stringify(records));
  
  // Also save to chrome.storage if in extension
  if (isExtension && chrome.storage) {
    chrome.storage.local.set({ purchaseRecords: records });
  }
};

// Add a new purchase record
export const addPurchaseRecord = (record: PurchaseRecord): void => {
  const records = getPurchaseRecords();
  records.unshift(record); // Add to beginning of array
  savePurchaseRecords(records);
  updateUserStats(record);
};

// Get user stats
export const getUserStats = (): UserStats => {
  if (isExtension && chrome.storage) {
    // For synchronous use in extension, fall back to localStorage
    const stats = localStorage.getItem(USER_STATS_KEY);
    return stats ? JSON.parse(stats) : initialUserStats;
  } else {
    const stats = localStorage.getItem(USER_STATS_KEY);
    return stats ? JSON.parse(stats) : initialUserStats;
  }
};

// Save user stats
export const saveUserStats = (stats: UserStats): void => {
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
  
  // Also save to chrome.storage if in extension
  if (isExtension && chrome.storage) {
    chrome.storage.local.set({ userStats: stats });
  }
};

// Update user stats when a purchase is made or saved
export const updateUserStats = (record: PurchaseRecord): void => {
  const stats = getUserStats();
  
  if (record.wasSaved) {
    stats.totalImpulsesStopped += 1;
    stats.totalMoneySaved += record.price;
    stats.weeklyImpulsesStopped += 1;
    stats.weeklyMoneySaved += record.price;
    stats.monthlyImpulsesStopped += 1;
    stats.monthlyMoneySaved += record.price;
  }
  
  saveUserStats(stats);
};

// Reset weekly stats (would be called by a scheduler)
export const resetWeeklyStats = (): void => {
  const stats = getUserStats();
  stats.weeklyImpulsesStopped = 0;
  stats.weeklyMoneySaved = 0;
  saveUserStats(stats);
};

// Reset monthly stats (would be called by a scheduler)
export const resetMonthlyStats = (): void => {
  const stats = getUserStats();
  stats.monthlyImpulsesStopped = 0;
  stats.monthlyMoneySaved = 0;
  saveUserStats(stats);
};

// Get savings goals
export const getSavingsGoals = (): SavingsGoal[] => {
  if (isExtension && chrome.storage) {
    // For synchronous use in extension, fall back to localStorage
    const goals = localStorage.getItem(SAVINGS_GOALS_KEY);
    return goals ? JSON.parse(goals) : [];
  } else {
    const goals = localStorage.getItem(SAVINGS_GOALS_KEY);
    return goals ? JSON.parse(goals) : [];
  }
};

// Save savings goals
export const saveSavingsGoals = (goals: SavingsGoal[]): void => {
  localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(goals));
  
  // Also save to chrome.storage if in extension
  if (isExtension && chrome.storage) {
    chrome.storage.local.set({ savingsGoals: goals });
  }
};

// Add a new savings goal
export const addSavingsGoal = (goal: SavingsGoal): void => {
  const goals = getSavingsGoals();
  goals.push(goal);
  saveSavingsGoals(goals);
};

// Update a savings goal
export const updateSavingsGoal = (goal: SavingsGoal): void => {
  const goals = getSavingsGoals();
  const index = goals.findIndex((g) => g.id === goal.id);
  if (index !== -1) {
    goals[index] = goal;
    saveSavingsGoals(goals);
  }
};

// Delete a savings goal
export const deleteSavingsGoal = (goalId: string): void => {
  const goals = getSavingsGoals();
  const newGoals = goals.filter((g) => g.id !== goalId);
  saveSavingsGoals(newGoals);
};

// Add saved money to a specific goal
export const addMoneyToGoal = (goalId: string, amount: number): void => {
  const goals = getSavingsGoals();
  const index = goals.findIndex((g) => g.id === goalId);
  if (index !== -1) {
    goals[index].currentAmount += amount;
    saveSavingsGoals(goals);
  }
};
