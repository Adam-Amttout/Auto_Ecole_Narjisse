<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table principale du dossier administratif
        Schema::create('dossiers_administratifs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');

            // Étapes administratives (bool)
            $table->boolean('visite_medicale')->default(false);
            $table->boolean('dossier_depose')->default(false);
            $table->boolean('exam_theorique_programme')->default(false);
            $table->boolean('exam_pratique_programme')->default(false);
            $table->boolean('permis_pret')->default(false);

            // Notes admin
            $table->text('notes_admin')->nullable();

            $table->timestamps();

            $table->unique('client_id'); // 1 dossier par client
        });

        // Table des documents uploadés
        Schema::create('documents_dossier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->string('type'); // cin, photo, certificat_medical, autre
            $table->string('nom_fichier');
            $table->string('chemin');
            $table->string('statut')->default('en_attente'); // en_attente, valide, rejete
            $table->text('remarque')->nullable(); // remarque admin si rejeté
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents_dossier');
        Schema::dropIfExists('dossiers_administratifs');
    }
};
