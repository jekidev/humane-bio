import { useAuth } from '@/_core/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { useLocation } from 'wouter';
import { Settings, Package, ShoppingCart, MessageSquare, Users, Upload } from 'lucide-react';
import { useState } from 'react';

export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('products');

  if (!isAuthenticated || user?.role !== 'admin') {
    setLocation('/');
    return null;
  }

  const [products, setProducts] = useState([
    { id: 1, name: 'Bromantan', category: 'nootropic', price: 4999, active: true },
    { id: 2, name: 'BPC 156', category: 'peptide', price: 7999, active: true },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      user: 'John Doe',
      email: 'john@example.com',
      total: 15999,
      status: 'paid',
      date: '2026-01-08',
      items: 3,
      shipping: { address: '123 Main St', city: 'New York', postal: '10001', country: 'US' },
    },
  ]);

  const [settings, setSettings] = useState({
    llmApiKey: '***',
    llmApiUrl: 'https://api.openai.com/v1',
    llmSystemPrompt: 'You are HumaneBio\'s AI assistant...',
    contactEmail: 'support@humanebio.com',
    contactDiscord: 'https://discord.gg/humanebio',
    contactTelegram: '@humanebio',
    contactWhatsapp: '+1234567890',
  });

  const [chatHistory, setChatHistory] = useState([
    { id: 1, user: 'User123', message: 'What\'s the best stack for focus?', response: 'I recommend...', date: '2026-01-08' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 molecular-bg">
      <Navigation />

      {/* Header */}
      <section className="py-12 border-b border-cyan-500/10">
        <div className="container max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-gray-400">Manage products, orders, and settings</p>
            </div>
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Settings className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border border-cyan-500/20 grid w-full grid-cols-5">
            <TabsTrigger value="products" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              <Users className="w-4 h-4 mr-2" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Product Management</h2>
              <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        <Badge className={product.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                          {product.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        Category: {product.category} • Price: ${(product.price / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-500/30 text-red-300 hover:bg-red-500/10">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Order Management</h2>

            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{order.id}</h3>
                        <p className="text-sm text-gray-400">{order.user} • {order.email}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">Paid</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 mb-1">Shipping Address</p>
                        <p className="text-white">
                          {order.shipping.address}<br />
                          {order.shipping.city}, {order.shipping.postal}<br />
                          {order.shipping.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Order Details</p>
                        <p className="text-white">
                          Items: {order.items}<br />
                          Total: ${(order.total / 100).toFixed(2)}<br />
                          Date: {order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
                        Mark Shipped
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Chat History</h2>

            <div className="space-y-4">
              {chatHistory.map((chat) => (
                <Card key={chat.id} className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{chat.user}</p>
                      <p className="text-xs text-gray-400">{chat.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">User Message:</p>
                      <p className="text-white bg-slate-700/50 p-3 rounded">{chat.message}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Assistant Response:</p>
                      <p className="text-white bg-slate-700/50 p-3 rounded">{chat.response}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Newsletter Subscribers</h2>
            <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 text-center">
              <p className="text-gray-400">Newsletter subscriber management coming soon</p>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Settings</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* LLM Settings */}
              <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
                <h3 className="text-lg font-semibold text-white mb-4">LLM Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">API Key</label>
                    <Input
                      type="password"
                      value={settings.llmApiKey}
                      className="bg-slate-700 border-slate-600 text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">API URL</label>
                    <Input
                      type="text"
                      value={settings.llmApiUrl}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">System Prompt</label>
                    <textarea
                      value={settings.llmSystemPrompt}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 min-h-24"
                    />
                  </div>
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
                    Save LLM Settings
                  </Button>
                </div>
              </Card>

              {/* Contact Settings */}
              <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Email</label>
                    <Input
                      type="email"
                      value={settings.contactEmail}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Discord</label>
                    <Input
                      type="text"
                      value={settings.contactDiscord}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Telegram</label>
                    <Input
                      type="text"
                      value={settings.contactTelegram}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">WhatsApp</label>
                    <Input
                      type="text"
                      value={settings.contactWhatsapp}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
                    Save Contact Settings
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
