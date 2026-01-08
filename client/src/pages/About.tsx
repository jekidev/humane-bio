import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      >
        <source src="/grok-video-fd1227dd-2dfc-4c55-80ec-6d0542ab57a4.mp4" type="video/mp4" />
      </video>

      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25"
        style={{
          backgroundImage: 'url(/fca4a796-d6bb-4eb8-9383-3e3980abe17f.jpg)',
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
              About HumaneBio
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Advancing human potential through scientifically-validated research compounds
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 border-b border-gray-200">
          <div className="container max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  HumaneBio is dedicated to providing premium research chemicals and bioactive peptides
                  to scientists, researchers, and individuals interested in cognitive optimization and
                  human performance enhancement.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  We believe in transparency, scientific rigor, and the power of informed decision-making.
                  Every product we offer is backed by peer-reviewed research and rigorous quality testing.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our mission is to democratize access to cutting-edge research compounds while maintaining
                  the highest standards of safety, purity, and ethical responsibility.
                </p>
              </motion.div>
              <motion.div
                className="relative h-96 rounded-2xl overflow-hidden border border-gray-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                  src="/grok-video-fd1227dd-2dfc-4c55-80ec-6d0542ab57a4.mp4"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 border-b border-gray-200">
          <div className="container max-w-6xl">
            <motion.h2
              className="text-3xl font-bold text-black mb-12 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Core Values
            </motion.h2>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
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
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 border border-gray-300 bg-white/90 backdrop-blur h-full">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">{value.title}</h3>
                        <p className="text-gray-600 text-sm">{value.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 border-b border-gray-200">
          <div className="container max-w-6xl">
            <motion.h2
              className="text-3xl font-bold text-black mb-12 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Team
            </motion.h2>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
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
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 border border-gray-300 bg-white/90 backdrop-blur text-center h-full">
                    <div className="w-20 h-20 rounded-full bg-black mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-1">{member.name}</h3>
                    <p className="text-gray-700 text-sm font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 bg-white/50">
          <div className="container max-w-6xl text-center text-gray-600 text-sm">
            <p>&copy; 2026 HumaneBio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
