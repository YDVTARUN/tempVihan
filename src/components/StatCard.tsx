
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendValue 
}: StatCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            {icon}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-2xl font-bold">{value}</p>
          {description && <p className="text-sm text-gray-500">{description}</p>}
          
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <div
                className={`flex items-center text-xs font-medium rounded-full px-2 py-0.5 ${
                  trend === "up"
                    ? "bg-green-100 text-green-700"
                    : trend === "down"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {trend === "up" ? (
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                ) : trend === "down" ? (
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                ) : null}
                {trendValue}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
