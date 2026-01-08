import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: cartItems = [], isLoading, refetch } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      toast.success("Item removed from cart");
      refetch();
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      toast.success("Cart cleared");
      refetch();
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please log in to view your cart");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.quantity * 100), 0) / 100; // Placeholder calculation

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-foreground">Product {item.productId}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItemMutation.mutate({ cartId: item.id })}
                    disabled={removeItemMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>

            <Card className="p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-foreground">Total:</span>
                <span className="text-2xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => clearCartMutation.mutate()}
                  disabled={clearCartMutation.isPending}
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={() => navigate("/checkout")}
                  className="flex-1"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
                  Proceed to Checkout
                </Button>
              </div>
            </Card>

            <Button variant="outline" onClick={() => navigate("/products")} className="w-full">
              Continue Shopping
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
