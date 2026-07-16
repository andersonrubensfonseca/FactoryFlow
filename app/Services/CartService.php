<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;

class CartService
{
    private const SESSION_KEY = 'cart';

    public function add(Product $product, int $quantity = 1): void
    {
        $items = $this->raw();

        $currentQuantity = $items[$product->id] ?? 0;
        $newQuantity = min($currentQuantity + $quantity, $product->stock);

        if ($newQuantity <= 0) {
            return;
        }

        $items[$product->id] = $newQuantity;

        Session::put(self::SESSION_KEY, $items);
    }

    public function update(int $productId, int $quantity): void
    {
        $items = $this->raw();

        if ($quantity <= 0) {
            unset($items[$productId]);
        } else {
            $items[$productId] = $quantity;
        }

        Session::put(self::SESSION_KEY, $items);
    }

    public function remove(int $productId): void
    {
        $items = $this->raw();

        unset($items[$productId]);

        Session::put(self::SESSION_KEY, $items);
    }

    /**
     * @return Collection<int, array{product: Product, quantity: int, subtotal: float}>
     */
    public function items(): Collection
    {
        $items = $this->raw();

        if ($items === []) {
            return collect();
        }

        return Product::query()
            ->whereIn('id', array_keys($items))
            ->get()
            ->map(fn (Product $product) => [
                'product' => $product,
                'quantity' => $items[$product->id],
                'subtotal' => (float) $product->price * $items[$product->id],
            ]);
    }

    public function count(): int
    {
        return (int) $this->items()->sum('quantity');
    }

    public function total(): float
    {
        return (float) $this->items()->sum('subtotal');
    }

    /**
     * @return array<int, int>
     */
    private function raw(): array
    {
        return Session::get(self::SESSION_KEY, []);
    }

    public function clear(): void
    {
        Session::forget(self::SESSION_KEY);
    }
}