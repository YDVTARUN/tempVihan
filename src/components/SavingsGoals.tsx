
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSavingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } from "@/lib/storage";
import { SavingsGoal } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const SavingsGoals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  useEffect(() => {
    // Load savings goals from localStorage
    const savedGoals = getSavingsGoals();
    setGoals(savedGoals);
  }, []);

  const handleAddGoal = () => {
    if (newGoalName.trim() === "" || !newGoalTarget || parseFloat(newGoalTarget) <= 0) {
      return;
    }

    const newGoal: SavingsGoal = {
      id: uuidv4(),
      name: newGoalName,
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: 0,
    };

    addSavingsGoal(newGoal);
    setGoals([...goals, newGoal]);
    setNewGoalName("");
    setNewGoalTarget("");
    setIsAddingGoal(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteSavingsGoal(goalId);
    setGoals(goals.filter((goal) => goal.id !== goalId));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Savings Goals</h2>
        {!isAddingGoal && (
          <Button 
            variant="outline" 
            className="border-purple-300 text-purple-700"
            onClick={() => setIsAddingGoal(true)}
          >
            <PlusCircle size={16} className="mr-2" />
            Add Goal
          </Button>
        )}
      </div>

      {isAddingGoal && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">New Savings Goal</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., New Laptop"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-target">Target Amount ($)</Label>
                <Input
                  id="goal-target"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1000.00"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleAddGoal}
                >
                  Save Goal
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingGoal(false);
                    setNewGoalName("");
                    setNewGoalTarget("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 ? (
        <div className="bg-purple-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-purple-800 mb-2">No savings goals yet</h3>
          <p className="text-purple-600 mb-4">
            Create a savings goal and redirect your impulse purchases to something meaningful!
          </p>
          {!isAddingGoal && (
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsAddingGoal(true)}
            >
              Create Your First Goal
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <Card key={goal.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{goal.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{Math.min(100, Math.round(progress))}%</span>
                    </div>
                    <Progress value={Math.min(100, progress)} className="h-2" />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-purple-700 font-medium">
                        ${goal.currentAmount.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        of ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
