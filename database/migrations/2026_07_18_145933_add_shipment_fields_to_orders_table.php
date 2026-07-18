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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('melhor_envio_shipment_id')->nullable()->after('shipping_status');
            $table->string('shipment_label_url')->nullable()->after('melhor_envio_shipment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('shipment_label_url');
            $table->dropColumn('melhor_envio_shipment_id');
        });
    }
};
