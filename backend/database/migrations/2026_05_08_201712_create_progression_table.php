<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('progression', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('cours_id');
            $table->timestamps();

            // Un client ne peut marquer un cours qu'une seule fois
            $table->unique(['client_id', 'cours_id']);

            $table->foreign('cours_id')->references('id')->on('cours')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progression');
    }
};
