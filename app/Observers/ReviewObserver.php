<?php

namespace App\Observers;

use App\Models\Review;

class ReviewObserver
{
    public function saved(Review $review): void
    {
        $this->recalculate($review);
    }

    public function deleted(Review $review): void
    {
        $this->recalculate($review);
    }

    private function recalculate(Review $review): void
    {
        $product = $review->product;

        $product->update([
            'rating' => $product->reviews()->avg('rating') ?? 0,
        ]);
    }
}