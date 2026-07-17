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
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('weight')->default(0)->after('image_path')->comment('gramas');
            $table->unsignedInteger('height')->default(0)->after('weight')->comment('cm');
            $table->unsignedInteger('width')->default(0)->after('height')->comment('cm');
            $table->unsignedInteger('length')->default(0)->after('width')->comment('cm');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('weight');
            $table->dropColumn('height');
            $table->dropColumn('width');
            $table->dropColumn('length');
        });
    }
};
