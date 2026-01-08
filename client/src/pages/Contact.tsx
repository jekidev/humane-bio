import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      >
        <source src="/grok-video-c53c14b7-1f94-419c-a4c1-dfacd50c05cb.mp4" type="video/mp4" />
      </video>

      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25"
        style={{
          backgroundImage: 'url(/dcb3fce0-0994-4a74-9871-d5a58136161f.jpg)',
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
              Contact Us
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Get in touch with our team for support, inquiries, or partnerships
            </motion.p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <div className="container max-w-6xl py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="text-2xl font-bold text-black mb-8">Get in Touch</h2>
                <p className="text-gray-700 mb-8">
                  Have questions about our products or services? We're here to help. Reach out through any of these channels.
                </p>
              </div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
              >
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 border border-gray-300 bg-white/90 backdrop-blur hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <Mail className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black mb-1">Email</h3>
                        <a
                          href="mailto:support@humanebio.com"
                          className="text-gray-700 hover:text-black transition-colors"
                        >
                          support@humanebio.com
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                          Response time: 24-48 hours
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Discord */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 border border-gray-300 bg-white/90 backdrop-blur hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <MessageCircle className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black mb-1">Discord</h3>
                        <a
                          href="https://discord.gg/humanebio"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-black transition-colors"
                        >
                          Join our Community
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                          Real-time chat with team and community
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Telegram */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 border border-gray-300 bg-white/90 backdrop-blur hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <Send className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black mb-1">Telegram</h3>
                        <a
                          href="https://t.me/humanebio"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-black transition-colors"
                        >
                          @humanebio
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                          Quick updates and announcements
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* WhatsApp */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-6 border border-gray-300 bg-white/90 backdrop-blur hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <MessageSquare className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black mb-1">WhatsApp</h3>
                        <a
                          href="https://wa.me/1234567890"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-black transition-colors"
                        >
                          +1 (234) 567-890
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                          Direct messaging support
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 border border-gray-300 bg-white/90 backdrop-blur">
                <h2 className="text-2xl font-bold text-black mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      placeholder="Message subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-gray-50 border-gray-300 text-black placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/50 min-h-32"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-900 text-white font-semibold"
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>

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
