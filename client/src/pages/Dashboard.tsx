import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { Package, Clock, Gift, User } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation('/');
    return null;
  }

  const orders = [
    {
      id: 'ORD-001',
      date: '2026-01-05',
      status: 'delivered',
      total: 15999,
      items: 3,
    },
    {
      id: 'ORD-002',
      date: '2026-01-02',
      status: 'shipped',
      total: 24999,
      items: 5,
    },
  ];

  const pendingOrders = [
    {
      id: 'ORD-003',
      date: '2026-01-08',
      estimatedDelivery: '2026-01-15',
      status: 'processing',
      total: 12999,
    },
  ];

  const discounts = [
    { code: 'WELCOME10', discount: '10%', expires: '2026-02-08' },
    { code: 'RESEARCH20', discount: '20%', expires: '2026-03-08' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-300';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-300';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 molecular-bg">
      <Navigation />

      {/* Header */}
      <section className="py-12 border-b border-cyan-500/10">
        <div className="container max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Member Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.name || 'Member'}</p>
            </div>
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <User className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container max-w-6xl py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-cyan-300">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-cyan-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-orange-300">{pendingOrders.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Discounts</p>
                <p className="text-3xl font-bold text-green-300">{discounts.length}</p>
              </div>
              <Gift className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-slate-800 border border-cyan-500/20">
            <TabsTrigger value="orders" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              Order History
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              Pending Orders
            </TabsTrigger>
            <TabsTrigger value="discounts" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              Discounts
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-600/30 data-[state=active]:text-cyan-300">
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Order History Tab */}
          <TabsContent value="orders" className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Card
                  key={order.id}
                  className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-white">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        {order.items} items • ${(order.total / 100).toFixed(2)}
                      </p>
                    </div>
                    <Button variant="outline" className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 text-center">
                <p className="text-gray-400 mb-4">No orders yet</p>
                <Link href="/products">
                  <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    Start Shopping
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          {/* Pending Orders Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <Card
                  key={order.id}
                  className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-white">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-cyan-300">
                        Expected delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Total: ${(order.total / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">In Transit</p>
                          <p className="text-lg font-bold text-cyan-300">50%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 text-center">
                <p className="text-gray-400">No pending orders</p>
              </Card>
            )}
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-4">
            {discounts.length > 0 ? (
              discounts.map((discount, idx) => (
                <Card
                  key={idx}
                  className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{discount.code}</h3>
                      <p className="text-2xl font-bold text-green-300 mb-2">{discount.discount} OFF</p>
                      <p className="text-sm text-gray-400">
                        Expires: {new Date(discount.expires).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      onClick={() => navigator.clipboard.writeText(discount.code)}
                    >
                      Copy Code
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 text-center">
                <p className="text-gray-400">No active discounts</p>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6 border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-lg text-white font-semibold">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-lg text-white font-semibold">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Member Since</label>
                  <p className="text-lg text-white font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
