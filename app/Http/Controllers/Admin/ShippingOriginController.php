<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingOrigin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShippingOriginController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/shipping-origin/edit', [
            'origin' => ShippingOrigin::current(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'document' => ['nullable', 'string', 'max:20'],
            'company_document' => ['nullable', 'string', 'max:20'],
            'state_register' => ['nullable', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'number' => ['required', 'string', 'max:20'],
            'complement' => ['nullable', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state_abbr' => ['required', 'string', 'size:2'],
            'postal_code' => ['required', 'string', 'max:9'],
        ]);

        $origin = ShippingOrigin::current();

        if ($origin) {
            $origin->update($validated);
        } else {
            ShippingOrigin::create($validated);
        }

        return back();
    }
}