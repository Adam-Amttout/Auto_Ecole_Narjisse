<?php
// database/migrations/xxxx_create_seances_conduite_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seances_conduite', function (Blueprint $table) {
            $table->id();

            // ⚠️ Référence vers votre table "clients" (pas "users")
            $table->foreignId('client_id')
                  ->constrained('clients')
                  ->onDelete('cascade');

            $table->foreignId('moniteur_id')
                  ->constrained('moniteurs')
                  ->onDelete('restrict');

            $table->foreignId('vehicule_id')
                  ->constrained('vehicules')
                  ->onDelete('restrict');

            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');

            $table->enum('statut', [
                'planifiee',
                'en_cours',
                'terminee',
                'annulee'
            ])->default('planifiee');

            $table->text('notes')->nullable();
            $table->timestamps();

            // Index pour accélérer les vérifications de conflits
            $table->index(['moniteur_id', 'date']);
            $table->index(['vehicule_id', 'date']);
            $table->index(['client_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seances_conduite');
    }
};