import { useRoute, useLocation } from 'wouter';
import { useState } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProductReviews from '@/components/ProductReviews';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const [, navigate] = useLocation();
  const productId = params?.id ? parseInt(params.id) : null;

  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: productId || 0 },
    { enabled: !!productId }
  );

  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      toast.success('Added to cart');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to cart');
    },
  });

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      >
        <source src="/grok-video-c0503e38-b757-4181-afb3-4b9539c1efb1.mp4" type="video/mp4" />
      </video>

      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25"
        style={{
          backgroundImage: 'url(/a249edfe-b71d-4156-9b2b-f70ffbd3ccfa.jpg)',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/10" />

      {/* Content */}
      <div className="relative z-10">
        <Navigation />

        {/* Header */}
        <section className="py-8 border-b border-gray-200">
          <div className="container max-w-6xl">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 text-gray-700 hover:text-black mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </button>
          </div>
        </section>

        {/* Main Content */}
        <div className="container max-w-6xl py-8 px-4 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* Product Image */}
            <div>
              <Card className="border border-gray-300 bg-white/90 overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.image || '/product-placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <Badge className="bg-black text-white capitalize mb-4">
                  {product.category}
                </Badge>
                <h1 className="text-2xl md:text-4xl font-bold text-black mb-4">{product.name}</h1>
                <p className="text-base md:text-xl text-gray-700 mb-6">{product.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8 p-6 bg-white/80 rounded-lg border border-gray-300">
                <p className="text-gray-600 text-sm mb-2">Price</p>
                <p className="text-3xl md:text-4xl font-bold text-black mb-6">
                  ${(product.price / 100).toFixed(2)}
                </p>

                <Button
                  size="lg"
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold"
                  onClick={() =>
                    addToCartMutation.mutate({
                      productId: product.id,
                      quantity: 1,
                    })
                  }
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Scientific Links */}
              {product.scientificLinks && (
                <div className="p-6 bg-white/80 rounded-lg border border-gray-300">
                  <h3 className="font-semibold text-black mb-4">Scientific Research</h3>
                  <div className="space-y-2">
                    {typeof product.scientificLinks === 'string'
                      ? JSON.parse(product.scientificLinks).map((link: string, idx: number) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm break-all"
                          >
                            {link}
                          </a>
                        ))
                      : null}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 md:mt-16">
            <ProductReviews productId={product.id} />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 bg-white/50 mt-12">
          <div className="container max-w-6xl">
            <div className="text-center text-gray-600 text-sm">
              <p>&copy; 2026 HumaneBio. All products are for research purposes only.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
