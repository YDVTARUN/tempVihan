
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImpulseModal from "./ImpulseModal";
import { ShoppingCart, DollarSign } from "lucide-react";
import { addMoneyToGoal } from "@/lib/storage";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 299.99,
    image: "https://via.placeholder.com/150?text=Headphones",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "https://via.placeholder.com/150?text=SmartWatch",
  },
  {
    id: 3,
    name: "Designer Hoodie",
    price: 89.99,
    image: "https://via.placeholder.com/150?text=Hoodie",
  },
];

const PurchaseSimulator = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveMoney = (amount: number) => {
    // In a real application, we would save this to a specific goal
    // For MVP, we'll just add it to the first goal (if any)
    // addMoneyToGoal("default-goal", amount);
    console.log(`Saved $${amount} instead of purchasing`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Purchase Simulator</h2>
      <p className="mb-6 text-gray-600">
        This simulates what happens when you try to make an impulsive purchase on an
        e-commerce site. Click "Buy Now" on any product to see the Impulse Vault in action.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-40 object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-purple-600 font-bold mt-2">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => handleBuyNow(product)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <ImpulseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          productName={selectedProduct.name}
          price={selectedProduct.price}
          onSaveMoney={handleSaveMoney}
        />
      )}
    </div>
  );
};

export default PurchaseSimulator;
