import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowRight, Zap, Brain, Beaker } from 'lucide-react';
import Navigation from '@/components/Navigation';
import AgeVerificationModal from '@/components/AgeVerificationModal';
import ChatAssistant from '@/components/ChatAssistant';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 molecular-bg">
      <AgeVerificationModal />
      <Navigation />
      <ChatAssistant />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated background video overlay */}
        <div className="absolute inset-0 opacity-20">
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            src="/grok-video-96e594c2-ceef-430b-aa05-24775bae685d.mp4"
          />
        </div>

        <div className="container relative z-10 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-cyan-300">Scientifically Validated</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-white">Optimize Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                    Cognitive Performance
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Discover premium nootropics and peptides backed by peer-reviewed research. Build your perfect stack with our AI-powered assistant.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-900 font-semibold text-lg px-8 py-6">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-semibold text-lg px-8 py-6"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-cyan-500/30 hud-glow">
                <img
                  src="/7a901027-cbf6-40cd-a95e-f3194007e3e5.png"
                  alt="HUD Visualization"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-cyan-500/10">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose HumaneBio</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Premium research chemicals with scientific validation and expert support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Recommendations',
                description: 'Our intelligent assistant helps you find the perfect stack based on your specific goals and needs.',
              },
              {
                icon: Beaker,
                title: 'Scientifically Validated',
                description: 'Every product includes links to peer-reviewed research papers and clinical studies.',
              },
              {
                icon: Zap,
                title: 'Premium Quality',
                description: 'Lab-tested purity and potency with full transparency and third-party verification.',
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-cyan-500/40 transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-cyan-500/10 w-fit mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Preview */}
      <section className="py-20 border-t border-cyan-500/10">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Collections</h2>
            <p className="text-gray-400 text-lg">Explore our carefully curated selection</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Nootropics',
                description: 'Cognitive enhancers designed to boost focus, memory, and mental clarity',
                color: 'from-cyan-600/20 to-cyan-500/10',
                border: 'border-cyan-500/30',
                items: ['Bromantan', 'Agmantine Sulfate', 'Phenyl Piracetam', '9-me-bc', 'Modafinil'],
              },
              {
                title: 'Peptides',
                description: 'Advanced bioactive peptides for cellular optimization and recovery',
                color: 'from-orange-600/20 to-orange-500/10',
                border: 'border-orange-500/30',
                items: ['BPC 156', 'TB500', 'Glutathion', 'Semax', 'Selank'],
              },
            ].map((category, idx) => (
              <Card
                key={idx}
                className={`p-8 border ${category.border} bg-gradient-to-br ${category.color} hover:shadow-lg transition-all duration-300`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                <p className="text-gray-400 mb-6">{category.description}</p>
                <div className="space-y-2 mb-6">
                  {category.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Explore {category.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-cyan-500/10">
        <div className="container max-w-4xl">
          <div className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-800 to-slate-900 p-12 overflow-hidden">
            {/* Background animation */}
            <div className="absolute inset-0 opacity-20">
              <video
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                src="/grok-video-c0503e38-b757-4181-afb3-4b9539c1efb1.mp4"
              />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Optimize?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have discovered their perfect cognitive stack. Our AI assistant is ready to help you get started.
              </p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-900 font-semibold px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-12 bg-slate-900/50">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">HumaneBio</h4>
              <p className="text-gray-400 text-sm">Premium nootropics and peptides backed by science.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products?category=nootropic" className="hover:text-cyan-300 transition-colors">Nootropics</Link></li>
                <li><Link href="/products?category=peptide" className="hover:text-cyan-300 transition-colors">Peptides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-cyan-300 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-cyan-300 transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-cyan-300 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-300 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 HumaneBio. All rights reserved. For research purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
