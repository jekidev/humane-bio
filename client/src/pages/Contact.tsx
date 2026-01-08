import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare, Send, Github, MessageCircle } from 'lucide-react';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 molecular-bg">
      <Navigation />

      {/* Header */}
      <section className="py-12 border-b border-cyan-500/10">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg">
            Get in touch with our team for support, inquiries, or partnerships
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <div className="container max-w-6xl py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Get in Touch</h2>
              <p className="text-gray-400 mb-8">
                Have questions about our products or services? We're here to help. Reach out through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-cyan-500/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email</h3>
                    <a
                      href="mailto:support@humanebio.com"
                      className="text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      support@humanebio.com
                    </a>
                    <p className="text-sm text-gray-400 mt-2">
                      Response time: 24-48 hours
                    </p>
                  </div>
                </div>
              </Card>

              {/* Discord */}
              <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-cyan-500/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <MessageCircle className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Discord</h3>
                    <a
                      href="https://discord.gg/humanebio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      Join our Community
                    </a>
                    <p className="text-sm text-gray-400 mt-2">
                      Real-time chat with team and community
                    </p>
                  </div>
                </div>
              </Card>

              {/* Telegram */}
              <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-cyan-500/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <Send className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Telegram</h3>
                    <a
                      href="https://t.me/humanebio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      @humanebio
                    </a>
                    <p className="text-sm text-gray-400 mt-2">
                      Quick updates and announcements
                    </p>
                  </div>
                </div>
              </Card>

              {/* WhatsApp */}
              <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-cyan-500/40 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                    <p className="text-sm text-gray-400 mt-2">
                      Direct messaging support
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-8 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="Message subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-32"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-900 font-semibold"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-12 bg-slate-900/50">
        <div className="container max-w-6xl text-center text-gray-500 text-sm">
          <p>&copy; 2026 HumaneBio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
