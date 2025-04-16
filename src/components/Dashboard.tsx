
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import BehaviorInsights from "@/components/BehaviorInsights";
import { getUserStats, getPurchaseRecords } from "@/lib/storage";
import { UserStats, PurchaseRecord } from "@/lib/types";
import { DollarSign, TrendingUp, Clock, ShoppingCart, Brain } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<PurchaseRecord[]>([]);

  useEffect(() => {
    // Load user stats from localStorage
    const userStats = getUserStats();
    setStats(userStats);

    // Load recent purchase records
    const records = getPurchaseRecords();
    setRecentActivity(records.slice(0, 5)); // Get last 5 records
  }, []);

  if (!stats) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">ImpulseLock Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-purple-300 text-purple-700">
            View All Activity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Saved"
          value={`$${stats.totalMoneySaved.toFixed(2)}`}
          icon={<DollarSign size={18} />}
          description="Across all time"
        />
        
        <StatCard 
          title="Impulses Stopped"
          value={stats.totalImpulsesStopped}
          icon={<TrendingUp size={18} />}
          description="Successful redirects"
          trend="up"
          trendValue="+3 this week"
        />
        
        <StatCard 
          title="Weekly Savings"
          value={`$${stats.weeklyMoneySaved.toFixed(2)}`}
          icon={<Clock size={18} />}
          description="Last 7 days"
        />
        
        <StatCard 
          title="Monthly Savings"
          value={`$${stats.monthlyMoneySaved.toFixed(2)}`}
          icon={<DollarSign size={18} />}
          description="This month"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        activity.wasSaved ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        <ShoppingCart size={16} />
                      </div>
                      <div>
                        <p className="font-medium">{activity.productName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-medium ${
                        activity.wasSaved ? 'text-green-600' : 'text-gray-700'
                      }`}>
                        {activity.wasSaved ? 'Saved' : 'Purchased'}: ${activity.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No recent activity to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Brain size={20} className="mr-2 text-purple-600" />
            Behavioral Insights
          </h2>
        </div>
        <BehaviorInsights />
      </div>
    </div>
  );
};

export default Dashboard;
