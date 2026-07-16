<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(CartService $cart): Response
    {
        return Inertia::render('store/cart', [
            'items' => $cart->items()->map(fn (array $item) => [
                'product' => [
                    'id' => $item['product']->id,
                    'name' => $item['product']->name,
                    'price' => (float) $item['product']->price,
                    'stock' => $item['product']->stock,
                    'image_url' => $item['product']->image_url,
                    'href' => route('products.show', $item['product']),
                ],
                'quantity' => $item['quantity'],
                'subtotal' => $item['subtotal'],
            ])->values(),
            'total' => $cart->total(),
        ]);
    }

    public function store(Request $request, CartService $cart): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        $cart->add($product, $validated['quantity'] ?? 1);

        return back();
    }

    public function update(Request $request, Product $product, CartService $cart): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $cart->update($product->id, $validated['quantity']);

        return back();
    }

    public function destroy(Product $product, CartService $cart): RedirectResponse
    {
        $cart->remove($product->id);

        return back();
    }
}