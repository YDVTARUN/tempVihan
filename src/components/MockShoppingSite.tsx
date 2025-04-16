
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImpulseModal from "./ImpulseModal";
import { ShoppingCart, CreditCard } from "lucide-react";

const MockShoppingSite = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const productName = "Premium Wireless Headphones";
  const productPrice = 249.99;

  const handleBuyNow = () => {
    setIsModalOpen(true);
  };

  const handleSaveMoney = (amount: number) => {
    console.log(`Saved $${amount} instead of purchasing`);
    // In a real extension, this would connect to your savings account or tracker
  };

  return (
    <div className="rounded-lg border overflow-hidden mb-8 bg-white">
      <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">ShopNow.com</h3>
          <div className="flex items-center space-x-4">
            <ShoppingCart size={20} />
            <span className="text-sm">Cart (1)</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-lg font-semibold mb-4">Checkout</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-3xl">🎧</span>
                </div>
                <div>
                  <h5 className="font-medium">{productName}</h5>
                  <p className="text-blue-600 font-bold">${productPrice}</p>
                  <p className="text-sm text-gray-500">Quantity: 1</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-3">Order Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${productPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span>$20.00</span>
                </div>
                <div className="border-t my-2 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(productPrice + 20).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="border rounded-lg p-4 mb-4">
              <h5 className="font-medium mb-3">Payment Method</h5>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="flex items-center mt-1">
                    <Input id="card-number" placeholder="4242 4242 4242 4242" />
                    <CreditCard className="ml-2 text-gray-400" size={20} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-3">Shipping Address</h5>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Smith" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            onClick={handleBuyNow}
          >
            <ShoppingCart className="mr-2" /> Place Order
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            By placing your order, you agree to ShopNow's Terms of Service
          </p>
        </div>
      </div>

      {isModalOpen && (
        <ImpulseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productName={productName}
          price={productPrice}
          onSaveMoney={handleSaveMoney}
        />
      )}
    </div>
  );
};

export default MockShoppingSite;
