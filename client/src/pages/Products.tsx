import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Bromantan',
    category: 'nootropic',
    price: 4999,
    description: 'Stimulant nootropic with mood-enhancing properties',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 2,
    name: 'Agmantine Sulfate',
    category: 'nootropic',
    price: 3999,
    description: 'Cognitive enhancer with neuroprotective properties',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 3,
    name: 'Phenyl Piracetam',
    category: 'nootropic',
    price: 5999,
    description: 'Enhanced piracetam derivative for cognitive performance',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 4,
    name: '9-me-bc',
    category: 'nootropic',
    price: 6999,
    description: 'Potent nootropic with neuroprotective effects',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 5,
    name: 'Modafinil',
    category: 'nootropic',
    price: 4499,
    description: 'Wakefulness-promoting agent for sustained focus',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 6,
    name: 'BPC 156',
    category: 'peptide',
    price: 7999,
    description: 'Bioactive peptide for cellular recovery and repair',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 7,
    name: 'TB500',
    category: 'peptide',
    price: 8999,
    description: 'Thymosin beta-4 for tissue repair and regeneration',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 8,
    name: 'Glutathion',
    category: 'peptide',
    price: 5999,
    description: 'Master antioxidant for cellular protection',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 9,
    name: 'Semax',
    category: 'peptide',
    price: 6999,
    description: 'Nootropic peptide for cognitive enhancement',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
  {
    id: 10,
    name: 'Selank',
    category: 'peptide',
    price: 6999,
    description: 'Anxiolytic peptide with mood-balancing effects',
    scientificLinks: ['https://pubmed.ncbi.nlm.nih.gov/'],
    image: '/product-placeholder.jpg',
  },
];

export default function Products() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'nootropic' | 'peptide'>('all');
  const [cart, setCart] = useState<Array<{ id: number; quantity: number }>>([]);

  const filteredProducts = SAMPLE_PRODUCTS.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  const handleAddToCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = SAMPLE_PRODUCTS.find((p) => p.id === item.id);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

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
        <section className="py-12 border-b border-gray-200">
          <div className="container max-w-6xl">
            <motion.h1
              className="text-4xl font-bold text-black mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Product Catalog
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Explore our scientifically-validated nootropics and peptides
            </motion.p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container max-w-6xl py-12 grid md:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="md:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="font-semibold text-black mb-4">Category</h3>
                <div className="space-y-2">
                  {[
                    { label: 'All Products', value: 'all' },
                    { label: 'Nootropics', value: 'nootropic' },
                    { label: 'Peptides', value: 'peptide' },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value as any)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-black text-white border border-gray-400 shadow-md'
                          : 'text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="p-4 rounded-lg border border-gray-300 bg-white/80">
                  <h4 className="font-semibold text-black mb-2">Cart Summary</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                  <p className="text-lg font-bold text-black mb-4">
                    ${(cartTotal / 100).toFixed(2)}
                  </p>
                  <Link href="/checkout">
                    <Button className="w-full bg-black hover:bg-gray-900 text-white">
                      Checkout
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border border-gray-300 bg-white/90 backdrop-blur overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-black text-white capitalize">
                        {product.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-black mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 flex-1">{product.description}</p>

                      {/* Price */}
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-black">
                          ${(product.price / 100).toFixed(2)}
                        </p>
                      </div>

                      {/* Scientific Links */}
                      {product.scientificLinks.length > 0 && (
                        <a
                          href={product.scientificLinks[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-gray-700 hover:text-black mb-4 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Research
                        </a>
                      )}

                      {/* Actions */}
                      <Button
                        className="w-full bg-black hover:bg-gray-900 text-white font-semibold"
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
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
