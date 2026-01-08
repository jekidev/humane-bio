import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { DollarSign, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface PricingEditorProps {
  productId: number;
  currentPrice: number;
  onPriceUpdate: (price: number) => Promise<void>;
  isLoading?: boolean;
}

export default function PricingEditor({
  productId,
  currentPrice,
  onPriceUpdate,
  isLoading = false,
}: PricingEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (price < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    if (price === currentPrice) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onPriceUpdate(price);
      toast.success('Price updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update price');
      setPrice(currentPrice);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPrice(currentPrice);
    setIsEditing(false);
  };

  const displayPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <Card className="p-4 bg-gray-50 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-gray-600" />
          <div>
            <Label className="text-sm text-gray-600">Current Price</Label>
            {!isEditing ? (
              <p className="text-2xl font-bold text-black">{displayPrice(currentPrice)}</p>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-semibold text-gray-600">$</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={(price / 100).toFixed(2)}
                  onChange={(e) => setPrice(Math.round(parseFloat(e.target.value) * 100))}
                  className="w-32 border-gray-300"
                  disabled={isSaving}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="border-gray-300"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit Price
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="bg-black text-white hover:bg-gray-900"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="border-gray-300"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
