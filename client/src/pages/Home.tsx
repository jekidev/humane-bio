import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Beaker, Microscope, Zap, Award, Users, BookOpen } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Beaker,
      title: 'Research Grade',
      description: 'Laboratory-tested compounds with verified purity and potency',
    },
    {
      icon: Microscope,
      title: 'Scientific Validation',
      description: 'Every product backed by peer-reviewed research and clinical studies',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Third-party tested and certified for safety and efficacy',
    },
    {
      icon: Zap,
      title: 'Performance Optimized',
      description: 'Carefully selected compounds for cognitive and physical enhancement',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'AI-powered guidance to build your perfect stack',
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Comprehensive blog with research insights and guides',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/mmo_character_portrait.png"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container max-w-6xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-black">
              HumaneBio
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light">
              Premium Research Chemicals & Peptides
            </p>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Scientifically-validated nootropics and peptides for cognitive enhancement and human optimization. Every product backed by peer-reviewed research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-black text-white hover:bg-gray-900 smooth-transition">
                  Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-black text-black hover:bg-gray-100 smooth-transition">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-black rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-black rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Why Choose HumaneBio</h2>
            <p className="text-xl text-gray-600">Premium quality, scientific integrity, and expert support</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card
                key={idx}
                className="p-8 border border-gray-200 bg-white hover:shadow-lg smooth-transition"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-24 px-4 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Our Collections</h2>
            <p className="text-xl text-gray-600">Carefully curated compounds for optimal results</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Nootropics */}
            <Card className="overflow-hidden border border-gray-200 hover:shadow-lg smooth-transition">
              <div className="h-64 bg-gray-100 overflow-hidden relative">
                <img
                  src="/5be9deca-3ab9-494f-ba21-f7191e8cb063.png"
                  alt="Nootropics"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Nootropics</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Cognitive enhancers including Bromantan, Modafinil, Phenyl Piracetam, and more. Designed to improve focus, memory, and mental clarity.
                </p>
                <Link href="/products?category=nootropic">
                  <Button variant="outline" className="border-black text-black hover:bg-gray-100">
                    View Nootropics <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Peptides */}
            <Card className="overflow-hidden border border-gray-200 hover:shadow-lg smooth-transition">
              <div className="h-64 bg-gray-100 overflow-hidden relative">
                <img
                  src="/3a28830d-92a3-4373-b7a2-a4d7b533b25b.png"
                  alt="Peptides"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-black mb-3">Peptides</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Bioactive peptides including BPC 156, TB500, Semax, and Selank. Optimized for recovery, regeneration, and cognitive enhancement.
                </p>
                <Link href="/products?category=peptide">
                  <Button variant="outline" className="border-black text-black hover:bg-gray-100">
                    View Peptides <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-black text-white">
        <div className="container max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Optimize?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Use our AI-powered chat assistant to find the perfect stack tailored to your goals.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 smooth-transition">
              Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; 2026 HumaneBio. All products are for research purposes only.</p>
            <p className="mt-2">These statements have not been evaluated by regulatory authorities. These products are not intended to diagnose, treat, cure, or prevent any disease.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
