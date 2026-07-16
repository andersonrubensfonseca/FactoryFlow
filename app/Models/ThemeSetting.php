<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeSetting extends Model
{
    /** @var array<int, string> */
    protected $fillable = [
        'primary_color_light',
        'primary_color_dark',
    ];

    public static function current(): self
    {
        return static::firstOrCreate([], [
            'primary_color_light' => '#2563EB',
            'primary_color_dark' => '#3B82F6',
        ]);
    }

    public function cssVariables(): string
    {
        $lightForeground = $this->foregroundFor($this->primary_color_light);
        $darkForeground = $this->foregroundFor($this->primary_color_dark);

        return <<<CSS
        :root {
            --primary: {$this->primary_color_light};
            --primary-foreground: {$lightForeground};
            --ring: {$this->primary_color_light};
            --sidebar-primary: {$this->primary_color_light};
            --sidebar-primary-foreground: {$lightForeground};
        }

        .dark {
            --primary: {$this->primary_color_dark};
            --primary-foreground: {$darkForeground};
            --ring: {$this->primary_color_dark};
            --sidebar-primary: {$this->primary_color_dark};
            --sidebar-primary-foreground: {$darkForeground};
        }
        CSS;
    }

    private function foregroundFor(string $hex): string
    {
        $hex = ltrim($hex, '#');
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

        $luminance = (0.299 * $r + 0.587 * $g + 0.114 * $b) / 255;

        return $luminance > 0.6 ? 'oklch(0.205 0 0)' : 'oklch(0.985 0 0)';
    }
}