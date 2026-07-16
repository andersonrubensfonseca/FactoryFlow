<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ThemeSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ThemeController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/theme/edit', [
            'theme' => ThemeSetting::current()->only(['primary_color_light', 'primary_color_dark']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'primary_color_light' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'primary_color_dark' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        ThemeSetting::current()->update($validated);

        return back();
    }
}