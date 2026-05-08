<?php
// database/migrations/xxxx_create_cours_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->enum('categorie', ['danger', 'indication', 'interdiction', 'autre'])
                  ->default('autre');
            $table->string('image')->nullable();
            $table->enum('niveau', ['debutant', 'intermediaire', 'avance'])
                  ->default('debutant');
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};