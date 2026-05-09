<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Mettre toutes les images à null
        DB::table('faqs')->update([
            'image' => null
        ]);

        // Modifier certains textes si nécessaire
        DB::table('faqs')
            ->where('question', 'Puis-je choisir mon moniteur ?')
            ->update([
                'reponse' => 'Oui, selon disponibilité, vous pouvez choisir votre moniteur préféré.'
            ]);

        DB::table('faqs')
            ->where('question', 'Comment réserver une séance ?')
            ->update([
                'reponse' => 'La réservation peut se faire directement à l\'agence ou via notre formulaire en ligne.'
            ]);
    }

    public function down(): void
    {
        //
    }
};