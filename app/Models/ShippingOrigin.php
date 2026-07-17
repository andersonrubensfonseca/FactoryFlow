<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingOrigin extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'name', 'email', 'phone',
        'document', 'company_document', 'state_register',
        'address', 'number', 'complement', 'district', 'city', 'state_abbr', 'postal_code',
    ];

    public static function current(): ?self
    {
        return static::first();
    }

    /**
     * @return array<string, string|null>
     */
    public function toMelhorEnvioPayload(): array
    {
        $payload = [
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'number' => $this->number,
            'complement' => $this->complement,
            'district' => $this->district,
            'city' => $this->city,
            'state_abbr' => $this->state_abbr,
            'postal_code' => $this->postal_code,
        ];

        if ($this->company_document) {
            $payload['company_document'] = $this->company_document;
            $payload['state_register'] = $this->state_register ?: 'ISENTO';
        } else {
            $payload['document'] = $this->document;
        }

        return $payload;
    }
}