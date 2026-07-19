<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array{category_id: int, name: string, slug: string, description: string, price: float, stock: int, min_stock: int, rating: float, weight: int, height: int, width: int, length: int}
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 20, 500),
            'stock' => fake()->numberBetween(0, 100),
            'min_stock' => 5,
            'rating' => fake()->randomFloat(1, 3, 5),
            'weight' => fake()->numberBetween(100, 5000),
            'height' => fake()->numberBetween(5, 40),
            'width' => fake()->numberBetween(5, 40),
            'length' => fake()->numberBetween(5, 40),
        ];
    }
}
