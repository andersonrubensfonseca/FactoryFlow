<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
{
    $categories = Category::query()
        ->latest()
        ->take(4)
        ->get()
        ->map(fn (Category $category) => [
            'title' => $category->name,
            'href' => route('products.index', ['categoria' => $category->slug]),
        ]);

    $featuredProducts = Product::query()
        ->latest()
        ->take(8)
        ->get()
        ->map(fn (Product $product) => [
            'id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'rating' => (float) $product->rating,
            'stock' => $product->stock,
            'image_url' => $product->image_url,
            'href' => route('products.show', $product),
        ]);

    return Inertia::render('store/home', [
        'categories' => $categories,
        'featuredProducts' => $featuredProducts,
        'productsHref' => route('products.index'),
    ]);
}
}
