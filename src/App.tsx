
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Check if we're running in a Chrome extension context
const isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

const App = () => {
  const [isExtension, setIsExtension] = useState(false);

  useEffect(() => {
    // Check if running in Chrome extension context
    if (isChromeExtension) {
      setIsExtension(true);
      
      // In extension mode, we need to sync localStorage with chrome.storage
      const syncStorage = async () => {
        if (chrome && chrome.storage) {
          // Get data from chrome.storage
          chrome.storage.local.get(['purchaseRecords', 'userStats', 'savingsGoals'], (data) => {
            // Update localStorage with chrome.storage data
            if (data.purchaseRecords) {
              localStorage.setItem('impulselock-purchase-records', JSON.stringify(data.purchaseRecords));
            }
            
            if (data.userStats) {
              localStorage.setItem('impulselock-user-stats', JSON.stringify(data.userStats));
            }
            
            if (data.savingsGoals) {
              localStorage.setItem('impulselock-savings-goals', JSON.stringify(data.savingsGoals));
            }
          });
        }
      };
      
      syncStorage();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index isExtension={isExtension} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
