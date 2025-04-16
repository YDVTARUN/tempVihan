
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPurchaseRecords } from "@/lib/storage";
import { PurchaseRecord } from "@/lib/types";

// Simulated NLP analysis - in a real extension this would use more sophisticated AI
const analyzeReasons = (reasons: string[]) => {
  const patterns = {
    emotional: ["sad", "happy", "feel", "feeling", "mood", "emotion", "bored", "stress", "stressed"],
    necessity: ["need", "required", "essential", "ran out", "broken", "replace"],
    bargain: ["sale", "discount", "deal", "cheap", "offer", "limited time", "promotion"],
    impulse: ["want", "cool", "love", "like", "nice", "looks good", "trendy", "popular"]
  };

  const counts = {
    emotional: 0,
    necessity: 0,
    bargain: 0,
    impulse: 0
  };

  reasons.forEach(reason => {
    const reasonLower = reason.toLowerCase();
    
    Object.entries(patterns).forEach(([key, words]) => {
      if (words.some(word => reasonLower.includes(word))) {
        counts[key as keyof typeof counts]++;
      }
    });
  });

  const total = reasons.length;
  return {
    emotional: Math.round((counts.emotional / total) * 100) || 0,
    necessity: Math.round((counts.necessity / total) * 100) || 0,
    bargain: Math.round((counts.bargain / total) * 100) || 0,
    impulse: Math.round((counts.impulse / total) * 100) || 0
  };
};

const getSpendingTimePatterns = (records: PurchaseRecord[]) => {
  const hourCounts: Record<number, number> = {};
  
  records.forEach(record => {
    const date = new Date(record.date);
    const hour = date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  // Find peak spending hours
  let maxCount = 0;
  let peakHours: number[] = [];
  
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      peakHours = [parseInt(hour)];
    } else if (count === maxCount) {
      peakHours.push(parseInt(hour));
    }
  });
  
  return {
    peakHours,
    hourCounts
  };
};

const BehaviorInsights = () => {
  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([]);
  const [insights, setInsights] = useState<{
    patterns: Record<string, number>;
    timePatterns: {
      peakHours: number[];
      hourCounts: Record<number, number>;
    };
  } | null>(null);

  useEffect(() => {
    const records = getPurchaseRecords();
    setPurchaseRecords(records);
    
    if (records.length > 0) {
      const reasons = records.map(record => record.reason);
      const patterns = analyzeReasons(reasons);
      const timePatterns = getSpendingTimePatterns(records);
      
      setInsights({
        patterns,
        timePatterns
      });
    }
  }, []);

  if (purchaseRecords.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No data yet</h3>
            <p className="text-gray-500">
              Use the Purchase Simulator to generate some data for behavior insights.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Behavior Insights (Beta)</CardTitle>
      </CardHeader>
      <CardContent>
        {insights && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Purchase Motivations</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(insights.patterns).map(([key, value]) => (
                  <div key={key} className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize">{key}</span>
                      <span className="text-purple-700 font-bold">{value}%</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Peak Shopping Times</h3>
              {insights.timePatterns.peakHours.length > 0 ? (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="mb-2">
                    You tend to shop most frequently at:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {insights.timePatterns.peakHours.map(hour => (
                      <span 
                        key={hour} 
                        className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? ' AM' : ' PM'}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Consider setting up extra reminders during these times to help with impulse control.
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Not enough data yet to determine peak shopping times.</p>
              )}
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">AI Personalized Tip</h3>
              <p className="text-gray-700">
                {insights.patterns.emotional > insights.patterns.necessity ? (
                  "Your purchase patterns suggest emotional spending might be a factor. Try implementing a 24-hour waiting period for non-essential purchases over $50."
                ) : insights.patterns.bargain > insights.patterns.necessity ? (
                  "You appear to be attracted to sales and discounts. Remember that a 'good deal' on something you don't need is still an unnecessary expense."
                ) : insights.patterns.impulse > insights.patterns.necessity ? (
                  "Your data shows several impulse purchases. Consider creating specific savings goals to visualize what you're saving for."
                ) : (
                  "Your purchasing patterns appear to be mostly necessity-based. Great job making mindful decisions!"
                )}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BehaviorInsights;
