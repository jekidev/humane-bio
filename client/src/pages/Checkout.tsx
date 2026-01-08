import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  shippingName: z.string().min(1, "Name is required"),
  shippingEmail: z.string().email("Valid email is required"),
  shippingAddress: z.string().min(1, "Address is required"),
  shippingCity: z.string().min(1, "City is required"),
  shippingPostal: z.string().min(1, "Postal code is required"),
  shippingCountry: z.string().min(1, "Country is required"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingName: user?.name || "",
    shippingEmail: user?.email || "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostal: "",
    shippingCountry: "",
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const { data: cartItems = [] } = trpc.cart.getItems.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createSessionMutation = trpc.cart.checkout.useMutation({
    onSuccess: (data: any) => {
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
        toast.success("Redirecting to payment...");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create checkout session");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Please log in to checkout");
    }
    if (cartItems.length === 0 && isAuthenticated) {
      navigate("/cart");
      toast.error("Your cart is empty");
    }
  }, [isAuthenticated, navigate, cartItems.length]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      checkoutSchema.parse(formData);
      setErrors({});
      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = `${window.location.origin}/cart`;
      createSessionMutation.mutate({
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.quantity * 100,
        })),
        successUrl,
        cancelUrl,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<CheckoutFormData> = {};
        error.issues.forEach((issue: any) => {
          const path = issue.path[0] as keyof CheckoutFormData;
          newErrors[path] = issue.message as any;
        });
        setErrors(newErrors);
      }
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.quantity * 100), 0) / 100;

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-foreground">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="shippingName">Full Name</Label>
                  <Input
                    id="shippingName"
                    name="shippingName"
                    value={formData.shippingName}
                    onChange={handleChange}
                    className={errors.shippingName ? "border-red-500" : ""}
                  />
                  {errors.shippingName && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="shippingEmail">Email</Label>
                  <Input
                    id="shippingEmail"
                    name="shippingEmail"
                    type="email"
                    value={formData.shippingEmail}
                    onChange={handleChange}
                    className={errors.shippingEmail ? "border-red-500" : ""}
                  />
                  {errors.shippingEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingEmail}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="shippingAddress">Address</Label>
                  <Input
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    className={errors.shippingAddress ? "border-red-500" : ""}
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shippingCity">City</Label>
                    <Input
                      id="shippingCity"
                      name="shippingCity"
                      value={formData.shippingCity}
                      onChange={handleChange}
                      className={errors.shippingCity ? "border-red-500" : ""}
                    />
                    {errors.shippingCity && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shippingPostal">Postal Code</Label>
                    <Input
                      id="shippingPostal"
                      name="shippingPostal"
                      value={formData.shippingPostal}
                      onChange={handleChange}
                      className={errors.shippingPostal ? "border-red-500" : ""}
                    />
                    {errors.shippingPostal && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingPostal}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="shippingCountry">Country</Label>
                  <Input
                    id="shippingCountry"
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    className={errors.shippingCountry ? "border-red-500" : ""}
                  />
                  {errors.shippingCountry && (
                    <p className="text-red-500 text-sm mt-1">{errors.shippingCountry}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createSessionMutation.isPending || cartItems.length === 0}
                >
                  {createSessionMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-foreground">Order Summary</h2>

              <div className="space-y-3 mb-6 border-b pb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product {item.productId} x{item.quantity}</span>
                    <span className="text-foreground">$0.00</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Calculated at next step</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-6" onClick={() => navigate("/cart")}>
                Back to Cart
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
