import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 molecular-bg">
      <Navigation />

      {/* Header */}
      <section className="py-12 border-b border-cyan-500/10">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-4">About HumaneBio</h1>
          <p className="text-gray-400 text-lg">
            Advancing human potential through scientifically-validated research compounds
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 border-b border-cyan-500/10">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                HumaneBio is dedicated to providing premium research chemicals and bioactive peptides
                to scientists, researchers, and individuals interested in cognitive optimization and
                human performance enhancement.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                We believe in transparency, scientific rigor, and the power of informed decision-making.
                Every product we offer is backed by peer-reviewed research and rigorous quality testing.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our mission is to democratize access to cutting-edge research compounds while maintaining
                the highest standards of safety, purity, and ethical responsibility.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden border border-cyan-500/30 hud-glow">
              <video
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
                src="/grok-video-fd1227dd-2dfc-4c55-80ec-6d0542ab57a4.mp4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 border-b border-cyan-500/10">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Scientific Integrity',
                description: 'All products are backed by peer-reviewed research and clinical evidence.',
              },
              {
                title: 'Transparency',
                description: 'Complete disclosure of ingredients, testing results, and sourcing information.',
              },
              {
                title: 'Quality Assurance',
                description: 'Third-party tested for purity, potency, and safety standards.',
              },
              {
                title: 'Customer Support',
                description: 'Expert guidance and personalized recommendations through our AI assistant.',
              },
              {
                title: 'Ethical Responsibility',
                description: 'Committed to legal compliance and responsible research practices.',
              },
              {
                title: 'Innovation',
                description: 'Continuously exploring new compounds and optimization strategies.',
              },
            ].map((value, idx) => (
              <Card
                key={idx}
                className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-gray-400 text-sm">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 border-b border-cyan-500/10">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Alex Johnson',
                role: 'Founder & CEO',
                bio: 'PhD in Neuroscience with 15+ years of research experience.',
              },
              {
                name: 'Dr. Emily Rodriguez',
                role: 'Chief Science Officer',
                bio: 'Specialist in peptide biochemistry and cellular optimization.',
              },
              {
                name: 'James Mitchell',
                role: 'Head of Operations',
                bio: 'Ensures quality, compliance, and customer satisfaction.',
              },
            ].map((member, idx) => (
              <Card
                key={idx}
                className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-cyan-300 text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-12 bg-slate-900/50">
        <div className="container max-w-6xl text-center text-gray-500 text-sm">
          <p>&copy; 2026 HumaneBio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
