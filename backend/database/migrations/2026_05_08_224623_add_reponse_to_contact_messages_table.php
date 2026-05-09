<?php
// Migration pour ajouter les colonnes de réponse admin à contact_messages
// Fichier : 2026_05_08_180000_add_reponse_to_contact_messages_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            // Réponse de l'admin
            $table->text('reponse_admin')->nullable()->after('lu');
            // Date d'envoi de la réponse
            $table->timestamp('repondu_le')->nullable()->after('reponse_admin');
            // Statut du message : nouveau, lu, repondu, archive
            $table->enum('statut', ['nouveau', 'lu', 'repondu', 'archive'])
                  ->default('nouveau')
                  ->after('repondu_le');
        });
    }

    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn(['reponse_admin', 'repondu_le', 'statut']);
        });
    }
};