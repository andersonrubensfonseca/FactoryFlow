<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipping_origins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        $table->string('email');
        $table->string('phone');
        $table->string('document')->nullable();
        $table->string('company_document')->nullable();
        $table->string('state_register')->nullable();
        $table->string('address');
        $table->string('number');
        $table->string('complement')->nullable();
        $table->string('district');
        $table->string('city');
        $table->string('state_abbr', 2);
        $table->string('postal_code', 9);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_origins');
    }
};
