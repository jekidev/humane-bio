import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Streamdown } from 'streamdown';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewsletterPrompt, setShowNewsletterPrompt] = useState(false);
  const [email, setEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.sendMessage.useMutation();
  const newsletterMutation = trpc.newsletter.subscribe.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage = {
        role: 'assistant' as const,
        content: "👋 Welcome to HumaneBio! I'm your AI assistant. Would you like help building the perfect nootropic or peptide stack tailored to your goals? I can provide personalized recommendations based on scientific research.",
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({ message: userMessage });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.content }]);

      // Show newsletter prompt after a few messages
      if (messages.length > 4 && !showNewsletterPrompt) {
        setShowNewsletterPrompt(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribeNewsletter = async () => {
    if (!email.trim()) return;

    try {
      await newsletterMutation.mutateAsync({ email: email.trim() });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '✅ Great! You\'ve been subscribed to our newsletter. You\'ll receive updates on new products, research, and exclusive offers.',
        },
      ]);
      setEmail('');
      setShowNewsletterPrompt(false);
    } catch (error) {
      console.error('Newsletter error:', error);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-glow-pulse"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-40 w-96 max-h-96 flex flex-col border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <h3 className="font-semibold text-cyan-300">HumaneBio Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-cyan-600/30 text-cyan-100 border border-cyan-500/30'
                      : 'bg-slate-700/50 text-gray-100 border border-slate-600/30'
                  }`}
                >
                  <Streamdown className="text-sm">{msg.content}</Streamdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-slate-700/50 text-gray-100">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Newsletter Prompt */}
          {showNewsletterPrompt && (
            <div className="px-4 py-3 border-t border-cyan-500/20 bg-slate-800/50">
              <p className="text-xs text-gray-400 mb-2">Subscribe to our newsletter:</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-xs bg-slate-700 border-slate-600"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubscribeNewsletter()}
                />
                <Button
                  size="sm"
                  className="h-8 bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
                  onClick={handleSubscribeNewsletter}
                  disabled={newsletterMutation.isPending}
                >
                  {newsletterMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Join'}
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-cyan-500/20 flex gap-2">
            <Input
              type="text"
              placeholder="Ask about products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
            />
            <Button
              size="icon"
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
