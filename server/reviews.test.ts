import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createReview, getProductReviews, getProductAverageRating, updateReviewApproval, deleteReview, getAllPendingReviews } from './db';
import { getDb } from './db';
import { reviews } from '../drizzle/schema';

describe('Review System', () => {
  let testProductId = 1;
  let testUserId = 1;
  let createdReviewId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (db) {
      // Clear existing test reviews
      await db.delete(reviews).where(reviews.productId.eq(testProductId));
    }
  });

  afterAll(async () => {
    const db = await getDb();
    if (db) {
      // Clean up test reviews
      await db.delete(reviews).where(reviews.productId.eq(testProductId));
    }
  });

  describe('createReview', () => {
    it('should create a new review', async () => {
      const result = await createReview({
        productId: testProductId,
        userId: testUserId,
        rating: 5,
        title: 'Excellent Product',
        content: 'This product exceeded my expectations!',
        verified: 'false',
        approved: 'false',
      });

      expect(result).toBeDefined();
      if (result && typeof result === 'object' && 'insertId' in result) {
        createdReviewId = Number(result.insertId);
        expect(createdReviewId).toBeGreaterThan(0);
      }
    });

    it('should create a review with minimum required fields', async () => {
      const result = await createReview({
        productId: testProductId,
        userId: testUserId,
        rating: 3,
        title: 'Average Product',
        content: 'It was okay',
        verified: 'false',
        approved: 'false',
      });

      expect(result).toBeDefined();
    });

    it('should handle invalid rating gracefully', async () => {
      const result = await createReview({
        productId: testProductId,
        userId: testUserId,
        rating: 10, // Invalid rating
        title: 'Test',
        content: 'Test content',
        verified: 'false',
        approved: 'false',
      });

      // Should still create but with the invalid value
      expect(result).toBeDefined();
    });
  });

  describe('getProductReviews', () => {
    it('should retrieve approved reviews for a product', async () => {
      // First approve a review
      if (createdReviewId) {
        await updateReviewApproval(createdReviewId, true);
      }

      const reviews = await getProductReviews(testProductId, true);
      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBeGreaterThan(0);
    });

    it('should retrieve all reviews (approved and pending)', async () => {
      const reviews = await getProductReviews(testProductId, false);
      expect(Array.isArray(reviews)).toBe(true);
    });

    it('should return empty array for non-existent product', async () => {
      const reviews = await getProductReviews(99999, true);
      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBe(0);
    });
  });

  describe('getProductAverageRating', () => {
    it('should calculate average rating for approved reviews', async () => {
      const avgRating = await getProductAverageRating(testProductId);
      expect(typeof avgRating).toBe('number');
      expect(avgRating).toBeGreaterThanOrEqual(0);
      expect(avgRating).toBeLessThanOrEqual(5);
    });

    it('should return 0 for product with no approved reviews', async () => {
      const avgRating = await getProductAverageRating(99999);
      expect(avgRating).toBe(0);
    });
  });

  describe('updateReviewApproval', () => {
    it('should approve a review', async () => {
      if (createdReviewId) {
        const success = await updateReviewApproval(createdReviewId, true);
        expect(success).toBe(true);

        // Verify the review is now approved
        const reviews = await getProductReviews(testProductId, true);
        const approvedReview = reviews.find((r: any) => r.id === createdReviewId);
        expect(approvedReview).toBeDefined();
        expect(approvedReview?.approved).toBe('true');
      }
    });

    it('should reject a review', async () => {
      if (createdReviewId) {
        const success = await updateReviewApproval(createdReviewId, false);
        expect(success).toBe(true);

        // Verify the review is now rejected
        const reviews = await getProductReviews(testProductId, true);
        const rejectedReview = reviews.find((r: any) => r.id === createdReviewId);
        expect(rejectedReview).toBeUndefined();
      }
    });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      if (createdReviewId) {
        const success = await deleteReview(createdReviewId);
        expect(success).toBe(true);

        // Verify the review is deleted
        const reviews = await getProductReviews(testProductId, false);
        const deletedReview = reviews.find((r: any) => r.id === createdReviewId);
        expect(deletedReview).toBeUndefined();
      }
    });

    it('should handle deletion of non-existent review', async () => {
      const success = await deleteReview(99999);
      expect(success).toBe(true); // Should still return true even if no review found
    });
  });

  describe('getAllPendingReviews', () => {
    it('should retrieve all pending reviews', async () => {
      // Create a pending review
      await createReview({
        productId: testProductId,
        userId: testUserId,
        rating: 4,
        title: 'Pending Review',
        content: 'This review is pending approval',
        verified: 'false',
        approved: 'false',
      });

      const pendingReviews = await getAllPendingReviews();
      expect(Array.isArray(pendingReviews)).toBe(true);
    });

    it('should not include approved reviews in pending list', async () => {
      // Create and approve a review
      const result = await createReview({
        productId: testProductId,
        userId: testUserId,
        rating: 5,
        title: 'Approved Review',
        content: 'This review is approved',
        verified: 'false',
        approved: 'true',
      });

      const pendingReviews = await getAllPendingReviews();
      if (result && typeof result === 'object' && 'insertId' in result) {
        const approvedReviewId = Number(result.insertId);
        const foundReview = pendingReviews.find((r: any) => r.id === approvedReviewId);
        expect(foundReview).toBeUndefined();
      }
    });
  });

  describe('Review validation', () => {
    it('should handle reviews with special characters', async () => {
      const result = await createReview({
        productId: testProductId,
        userId: testUserId,
        rating: 5,
        title: 'Great! <script>alert("xss")</script>',
        content: 'Content with special chars: @#$%^&*()',
        verified: 'false',
        approved: 'false',
      });

      expect(result).toBeDefined();
    });

    it('should handle very long review content', async () => {
      const longContent = 'A'.repeat(5000);
      const result = await createReview({
        productId: testProductId,
        userId: testUserId,
        rating: 4,
        title: 'Long Review',
        content: longContent,
        verified: 'false',
        approved: 'false',
      });

      expect(result).toBeDefined();
    });

    it('should handle reviews without user ID', async () => {
      const result = await createReview({
        productId: testProductId,
        userId: null,
        rating: 3,
        title: 'Anonymous Review',
        content: 'Posted anonymously',
        verified: 'false',
        approved: 'false',
      });

      expect(result).toBeDefined();
    });
  });
});
