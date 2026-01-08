import { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { toast } from 'sonner';

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  // Queries
  const { data: productRating, refetch: refetchRating } = trpc.reviews.getProductRating.useQuery({ productId });
  const { data: reviews = [], refetch: refetchReviews } = trpc.reviews.getProductReviews.useQuery({ productId });

  // Mutations
  const submitReviewMutation = trpc.reviews.submitReview.useMutation({
    onSuccess: () => {
      toast.success('Review submitted for moderation');
      setTitle('');
      setContent('');
      setRating(5);
      refetchReviews();
      refetchRating();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    submitReviewMutation.mutate({
      productId,
      rating,
      title: title.trim(),
      content: content.trim(),
    });
  };

  const StarRating = ({ value, interactive = false }: { value: number; interactive?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star}>
          {interactive ? (
            <button
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                size={24}
                className={star <= (hoveredRating || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            </button>
          ) : (
            <Star
              size={20}
              className={star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <Card className="p-6 bg-slate-900/50 border-slate-700">
        <h3 className="text-2xl font-bold mb-4 text-white">Customer Reviews</h3>
        <div className="flex items-center gap-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-white">{productRating?.averageRating?.toFixed(1) || '0'}</div>
            <div className="mt-2">
              <StarRating value={Math.round(productRating?.averageRating || 0)} />
            </div>
            <div className="text-sm text-gray-400 mt-2">
              Based on {productRating?.totalReviews || 0} reviews
            </div>
          </div>
        </div>
      </Card>

      {/* Review Submission Form */}
      {isAuthenticated ? (
        <Card className="p-6 bg-slate-900/50 border-slate-700">
          <h4 className="text-xl font-bold mb-4 text-white">Share Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating
              </label>
              <StarRating value={rating} interactive={true} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <Input
                type="text"
                placeholder="Summarize your experience..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/255</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Review
              </label>
              <textarea
                placeholder="Share your detailed experience with this product..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                rows={5}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{content.length}/5000</p>
            </div>

            <Button
              type="submit"
              disabled={submitReviewMutation.isPending || !title.trim() || !content.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {submitReviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="p-6 bg-slate-900/50 border-slate-700">
          <p className="text-gray-400">
            Please <a href="/login" className="text-cyan-400 hover:text-cyan-300">log in</a> to submit a review.
          </p>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-white">Recent Reviews</h4>
        {reviews && reviews.length > 0 ? (
          reviews.map((review: any) => (
            <Card key={review.id} className="p-6 bg-slate-900/50 border-slate-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-bold text-white">{review.title}</h5>
                  <div className="flex gap-2 mt-1">
                    <StarRating value={review.rating} />
                    {review.verified === 'true' && (
                      <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-3">{review.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))
        ) : (
          <Card className="p-6 bg-slate-900/50 border-slate-700">
            <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
