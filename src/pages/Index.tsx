import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import PurchaseSimulator from "@/components/PurchaseSimulator";
import SavingsGoals from "@/components/SavingsGoals";
import MockShoppingSite from "@/components/MockShoppingSite";
import Settings from "@/components/Settings";
import { Toaster } from "@/components/ui/sonner";
import { ShoppingCart, BarChart3, PiggyBank, Info, Store, Settings2 } from "lucide-react";

interface IndexProps {
  isExtension?: boolean;
}

const Index = ({ isExtension = false }: IndexProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
              <PiggyBank size={18} />
            </div>
            <h1 className="text-xl font-bold text-purple-800">ImpulseLock</h1>
          </div>
          <div className="text-sm text-purple-600 font-medium">
            Mindful Spending Assistant
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 size={16} />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center space-x-2">
              <ShoppingCart size={16} />
              <span>Purchase Simulator</span>
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center space-x-2">
              <Store size={16} />
              <span>Extension Demo</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center space-x-2">
              <PiggyBank size={16} />
              <span>Savings Goals</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings2 size={16} />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="simulator">
            <PurchaseSimulator />
          </TabsContent>
          
          <TabsContent value="demo">
            <div className="container mx-auto p-4">
              <h2 className="text-2xl font-bold mb-4">Extension Demo</h2>
              <p className="mb-6 text-gray-600">
                This demonstrates how ImpulseLock would work as a Chrome extension when you're on a checkout page. 
                When you click "Place Order", the Impulse Vault will appear and help you make a mindful decision.
              </p>
              <MockShoppingSite />
            </div>
          </TabsContent>
          
          <TabsContent value="goals">
            <SavingsGoals />
          </TabsContent>
          
          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white mt-10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center text-white">
                  <PiggyBank size={14} />
                </div>
                <span className="font-semibold text-purple-800">ImpulseLock</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Making mindful spending easier
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                © {new Date().getFullYear()} ImpulseLock MVP
              </span>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
