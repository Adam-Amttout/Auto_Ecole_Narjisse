<?php
// database/migrations/xxxx_create_vehicules_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('marque');
            $table->string('modele');
            $table->string('immatriculation', 20)->unique();
            $table->enum('disponibilite', ['disponible', 'en_maintenance', 'hors_service'])
                  ->default('disponible');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};