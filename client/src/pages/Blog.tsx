import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ArrowRight, Calendar, User } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 molecular-bg">
      <Navigation />

      {/* Header */}
      <section className="py-12 border-b border-cyan-500/10">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-4">HumaneBio Blog</h1>
          <p className="text-gray-400">
            Research, insights, and guides on nootropics and peptides
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <div className="container max-w-6xl py-12">
        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <Card
              key={post.id}
              className="p-8 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge className="bg-cyan-600/30 text-cyan-300">{post.category}</Badge>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                {post.title}
              </h2>

              <p className="text-gray-400 mb-6">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                </div>
                <Link href={`/blog/${post.id}`}>
                  <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-12 bg-slate-900/50 mt-12">
        <div className="container max-w-6xl text-center text-gray-500 text-sm">
          <p>&copy; 2026 HumaneBio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
