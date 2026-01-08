import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Edit2, Save } from 'lucide-react';
import { useLocation } from 'wouter';
import ImageUploadField from '@/components/ImageUploadField';

export default function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'nootropic', price: 0, description: '' });
  const [llmSettings, setLlmSettings] = useState({ apiUrl: '', prompt: '' });
  const [contactSettings, setContactSettings] = useState({ email: '', discord: '', telegram: '', whatsapp: '' } as any);

  // Queries
  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = trpc.admin.getProducts.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = trpc.admin.getOrders.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  const { data: chatHistory, isLoading: chatLoading } = trpc.admin.getChatHistory.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  const { data: currentLLMSettings } = trpc.admin.getLLMSettings.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  const { data: currentContactSettings } = trpc.admin.getContactSettings.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  // Update settings when data loads
  if (currentLLMSettings && !llmSettings.apiUrl) {
    setLlmSettings(currentLLMSettings);
  }
  if (currentContactSettings && !contactSettings.email) {
    setContactSettings(currentContactSettings);
  }

  // Mutations
  const updateProductMutation = trpc.admin.updateProduct.useMutation({
    onSuccess: () => {
      toast.success('Product updated successfully');
      setEditingProduct(null);
      refetchProducts();
    },
    onError: (error) => toast.error(error.message),
  });

  const createProductMutation = trpc.admin.createProduct.useMutation({
    onSuccess: () => {
      toast.success('Product created successfully');
      setNewProduct({ name: '', category: 'nootropic', price: 0, description: '' });
      refetchProducts();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateOrderStatusMutation = trpc.admin.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.success('Order status updated');
      refetchOrders();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateLLMSettingsMutation = trpc.admin.updateLLMSettings.useMutation({
    onSuccess: () => toast.success('LLM settings updated'),
    onError: (error) => toast.error(error.message),
  });

  const updateContactSettingsMutation = trpc.admin.updateContactSettings.useMutation({
    onSuccess: () => toast.success('Contact settings updated'),
    onError: (error) => toast.error(error.message),
  });

  if (authLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (user?.role !== 'admin') {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage products, orders, and settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
            <TabsTrigger value="products" className="data-[state=active]:bg-black data-[state=active]:text-white">Products</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-black data-[state=active]:text-white">Orders</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-black data-[state=active]:text-white">Chat</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-black data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6">Add New Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="border-gray-300"
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="nootropic">Nootropic</option>
                  <option value="peptide">Peptide</option>
                </select>
                <Input
                  type="number"
                  placeholder="Price (cents)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                  className="border-gray-300"
                />
              </div>
              <Textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border-gray-300 mb-4"
              />
              <Button
                onClick={() => createProductMutation.mutate(newProduct as any)}
                disabled={!newProduct.name || createProductMutation.isPending}
                className="bg-black text-white hover:bg-gray-900"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </Card>

            <Card className="p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6">Existing Products</h2>
              {productsLoading ? (
                <p className="text-gray-600">Loading products...</p>
              ) : (
                <div className="space-y-4">
                  {products?.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-black">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.category} • ${(product.price / 100).toFixed(2)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${product.active === 'true' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {product.active === 'true' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {product.description && <p className="text-sm text-gray-600 mb-3">{product.description}</p>}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                            className="border-gray-300"
                          >
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-black">Edit Product</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="Name"
                              defaultValue={editingProduct?.name}
                              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              className="border-gray-300"
                            />
                            <Textarea
                              placeholder="Description"
                              defaultValue={editingProduct?.description}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              className="border-gray-300"
                            />
                            <Input
                              type="number"
                              placeholder="Price (cents)"
                              defaultValue={editingProduct?.price}
                              onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) })}
                              className="border-gray-300"
                            />
                            <ImageUploadField
                              productId={editingProduct?.id}
                              currentImage={editingProduct?.image}
                              onUploadSuccess={(url) => {
                                setEditingProduct({ ...editingProduct, image: url });
                                toast.success('Image uploaded successfully');
                              }}
                            />
                            <Button
                              onClick={() => updateProductMutation.mutate({ id: editingProduct.id, ...editingProduct })}
                              disabled={updateProductMutation.isPending}
                              className="w-full bg-black text-white hover:bg-gray-900"
                            >
                              <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6">Orders</h2>
              {ordersLoading ? (
                <p className="text-gray-600">Loading orders...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-bold text-black">Order ID</th>
                        <th className="text-left py-3 px-4 font-bold text-black">Customer</th>
                        <th className="text-left py-3 px-4 font-bold text-black">Amount</th>
                        <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                        <th className="text-left py-3 px-4 font-bold text-black">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-700">#{order.id}</td>
                          <td className="py-3 px-4 text-gray-700">{order.shippingName || 'N/A'}</td>
                          <td className="py-3 px-4 text-gray-700">${(order.totalAmount / 100).toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded text-xs font-semibold ${
                              order.status === 'paid' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatusMutation.mutate({ orderId: order.id, status: e.target.value as any })}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6">Chat History</h2>
              {chatLoading ? (
                <p className="text-gray-600">Loading chat history...</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {chatHistory?.map((msg) => (
                    <div key={msg.id} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-50 border-l-4 border-blue-300' : 'bg-gray-50 border-l-4 border-gray-300'}`}>
                      <p className="text-xs font-bold text-gray-600 mb-1">{msg.role.toUpperCase()}</p>
                      <p className="text-sm text-gray-700">{msg.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* LLM Settings */}
            <Card className="p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6">LLM Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">API URL</label>
                  <Input
                    value={llmSettings.apiUrl}
                    onChange={(e) => setLlmSettings({ ...llmSettings, apiUrl: e.target.value })}
                    placeholder="https://api.example.com"
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">System Prompt</label>
                  <Textarea
                    value={llmSettings.prompt}
                    onChange={(e) => setLlmSettings({ ...llmSettings, prompt: e.target.value })}
                    placeholder="Enter the system prompt for the LLM"
                    className="border-gray-300 h-32"
                  />
                </div>
                <Button
                  onClick={() => updateLLMSettingsMutation.mutate(llmSettings)}
                  disabled={updateLLMSettingsMutation.isPending}
                  className="bg-black text-white hover:bg-gray-900"
                >
                  <Save className="mr-2 h-4 w-4" /> Save LLM Settings
                </Button>
              </div>
            </Card>

            {/* Contact Settings */}
            <Card className="p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Email</label>
                  <Input
                    value={contactSettings.email || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                    placeholder="contact@humanebio.com"
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Discord</label>
                  <Input
                    value={contactSettings.discord || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, discord: e.target.value })}
                    placeholder="https://discord.gg/..."
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Telegram</label>
                  <Input
                    value={contactSettings.telegram || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, telegram: e.target.value })}
                    placeholder="@humanebio"
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">WhatsApp</label>
                  <Input
                    value={contactSettings.whatsapp || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, whatsapp: e.target.value })}
                    placeholder="+1234567890"
                    className="border-gray-300"
                  />
                </div>
                <Button
                  onClick={() => updateContactSettingsMutation.mutate(contactSettings as any)}
                  disabled={updateContactSettingsMutation.isPending}
                  className="bg-black text-white hover:bg-gray-900"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Contact Settings
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
