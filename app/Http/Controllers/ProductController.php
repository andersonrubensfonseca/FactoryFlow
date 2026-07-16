<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedCategory = $request->string('categoria')->toString();

        $products = Product::query()
            ->with('category')
            ->when($selectedCategory, function ($query, $slug) {
                $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
            })
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'rating' => (float) $product->rating,
                'stock' => $product->stock,
                'image_url' => $product->image_url,
                'href' => route('products.show', $product),
            ]);

        $categories = Category::query()
            ->get(['id', 'name', 'slug'])
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'href' => route('products.index', ['categoria' => $category->slug]),
                'active' => $category->slug === $selectedCategory,
            ]);

        return Inertia::render('store/products/index', [
            'products' => $products,
            'categories' => $categories,
            'allProductsHref' => route('products.index'),
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'reviews.user']);

        return Inertia::render('store/products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => (float) $product->price,
                'rating' => (float) $product->rating,
                'stock' => $product->stock,
                'image_url' => $product->image_url,
                'category' => [
                    'name' => $product->category->name,
                    'href' => route('products.index', ['categoria' => $product->category->slug]),
                ],
            ],
            'reviews' => $product->reviews->map(fn (Review $review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'user_id' => $review->user_id,
                'user_name' => $review->user->name,
                'created_at' => $review->created_at->format('d/m/Y'),
            ]),
        ]);
    }
    
}
