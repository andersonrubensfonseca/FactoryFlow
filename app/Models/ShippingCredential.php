<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingCredential extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'access_token',
        'refresh_token',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'expires_at' => 'datetime',
        ];
    }

    public static function current(): ?self
    {
        return static::first();
    }
}