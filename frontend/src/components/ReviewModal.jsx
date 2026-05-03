import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Loader2, X } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const LABELS = ['', 'Terrible', 'Poor', 'OK', 'Good', 'Excellent'];

export default function ReviewModal({ isOpen, onClose, tourId, bookingId, tourTitle, onReviewSubmitted }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating) {
      toast({ variant: 'destructive', title: 'Rating required', description: 'Please select a star rating.' });
      return;
    }
    if (!comment.trim()) {
      toast({ variant: 'destructive', title: 'Comment required', description: 'Please write a short review.' });
      return;
    }

    setSubmitting(true);
    try {
      await apiService.createReview({ tour_id: tourId, booking_id: bookingId, rating, title, comment });
      toast({ title: 'Review submitted!', description: 'Thank you for sharing your experience.' });
      onReviewSubmitted?.();
      onClose();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Submission failed', description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const display = hovered || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Leave a Review</h2>
            {tourTitle && <p className="text-sm text-gray-500 mt-0.5 truncate max-w-xs">{tourTitle}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Star Picker */}
          <div>
            <Label className="mb-2 block">Your Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= display
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-100 text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {display > 0 && (
                <span className="ml-2 text-sm font-medium text-gray-600">{LABELS[display]}</span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="review-title" className="mb-1.5 block">Title <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarise your experience"
              maxLength={100}
            />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="review-comment" className="mb-1.5 block">Review</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you enjoy? Any tips for other travellers?"
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/1000</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-[#0B3D91] hover:bg-[#092C6B] text-white"
          >
            {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</> : 'Submit Review'}
          </Button>
        </div>
      </div>
    </div>
  );
}
