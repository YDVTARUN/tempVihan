
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { addPurchaseRecord } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { Timer, ShoppingCart, SaveIcon, XIcon } from "lucide-react";

interface ImpulseModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number;
  onSaveMoney: (amount: number) => void;
  website?: string;
}

const ImpulseModal = ({
  isOpen,
  onClose,
  productName,
  price,
  onSaveMoney,
  website,
}: ImpulseModalProps) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [reason, setReason] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && reason.trim().length >= 10) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(false);
    }
  }, [timeLeft, reason]);

  const handlePurchase = () => {
    const record = {
      id: uuidv4(),
      date: new Date().toISOString(),
      productName,
      price,
      reason,
      wasPurchased: true,
      wasSaved: false,
      website: website || window.location.hostname,
    };
    
    addPurchaseRecord(record);
    onClose();
  };

  const handleSaveMoney = () => {
    const record = {
      id: uuidv4(),
      date: new Date().toISOString(),
      productName,
      price,
      reason,
      wasPurchased: false,
      wasSaved: true,
      website: website || window.location.hostname,
    };
    
    addPurchaseRecord(record);
    onSaveMoney(price);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-700">Impulse Vault</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <XIcon size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Product:</span>
            <span className="font-medium">{productName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Price:</span>
            <span className="font-medium">${price.toFixed(2)}</span>
          </div>
          {website && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-500">Website:</span>
              <span className="font-medium text-purple-600">{website}</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-center items-center mb-4">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 border-4 border-purple-300">
              <div className="flex flex-col items-center">
                <Timer size={24} className="mb-1" />
                <span className="text-lg font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>
          
          <h3 className="text-center text-lg font-medium mb-4">
            {timeLeft > 0 
              ? `${timeLeft} seconds to think...` 
              : "Now, explain your decision"}
          </h3>
          
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Why are you buying this right now?
            </label>
            <Textarea
              id="reason"
              placeholder="I'm buying this because..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full"
              rows={3}
            />
            {reason.trim().length < 10 && (
              <p className="text-xs text-gray-500 mt-1">
                Please write at least 10 characters
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handlePurchase}
            disabled={!isUnlocked}
            className={`w-full ${
              isUnlocked 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={18} className="mr-2" />
            Continue with Purchase
          </Button>
          
          <Button
            onClick={handleSaveMoney}
            disabled={!isUnlocked}
            variant="outline"
            className={`w-full border-purple-300 text-purple-700 hover:bg-purple-50 ${
              !isUnlocked && "opacity-50 cursor-not-allowed"
            }`}
          >
            <SaveIcon size={18} className="mr-2" />
            Instead, I'll save ${price.toFixed(2)}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ImpulseModal;
