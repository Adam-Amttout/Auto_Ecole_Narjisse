<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            // client_id nullable → null = notif globale, sinon notif privée pour ce client
            $table->unsignedBigInteger('client_id')->nullable()->after('id');
            // lu → false par défaut, le client peut marquer comme lu
            $table->boolean('lu')->default(false)->after('color');
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn(['client_id', 'lu']);
        });
    }
};
