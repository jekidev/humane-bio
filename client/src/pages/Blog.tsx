import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Navigation from '@/components/Navigation';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Science Behind Nootropics: A Comprehensive Guide',
    excerpt: 'Explore the mechanisms of action and scientific evidence supporting popular nootropic compounds.',
    date: '2026-01-08',
    author: 'Dr. Sarah Chen',
    category: 'Research',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'Peptides for Recovery: How TB500 Works',
    excerpt: 'Understanding the role of thymosin beta-4 in tissue repair and athletic recovery.',
    date: '2026-01-05',
    author: 'Dr. James Wilson',
    category: 'Peptides',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Building Your First Nootropic Stack',
    excerpt: 'A beginner\'s guide to combining nootropics safely and effectively for cognitive enhancement.',
    date: '2026-01-02',
    author: 'Dr. Maria Garcia',
    category: 'Guide',
    readTime: '10 min read',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      >
        <source src="/grok-video-96e594c2-ceef-430b-aa05-24775bae685d.mp4" type="video/mp4" />
      </video>

      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25"
        style={{
          backgroundImage: 'url(/beae2f62-3025-4006-a35e-23e12adfedb6.jpg)',
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
              HumaneBio Blog
            </motion.h1>
            <motion.p
              className="text-xl text-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Research, insights, and guides on nootropics and peptides
            </motion.p>
          </div>
        </section>

        {/* Blog Posts */}
        <div className="container max-w-6xl py-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            {BLOG_POSTS.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-8 border border-gray-300 bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-gray-100 text-gray-700">{post.category}</Badge>
                    <span className="text-sm text-gray-600">{post.readTime}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-black mb-3 group-hover:text-gray-800 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-6">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <button className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors font-semibold">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 bg-white/50 mt-12">
          <div className="container max-w-6xl text-center text-gray-600 text-sm">
            <p>&copy; 2026 HumaneBio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
