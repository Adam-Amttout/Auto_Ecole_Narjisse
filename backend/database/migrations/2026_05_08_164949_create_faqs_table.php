<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question', 500);
            $table->text('reponse');
            $table->string('image', 500)->nullable(); // URL image optionnelle
            $table->unsignedSmallInteger('ordre')->default(0); // pour trier
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        // Données de départ (seed inline)
        DB::table('faqs')->insert([
            [
                'question'   => 'Combien coûte la formation ?',
                'reponse'    => 'Le tarif dépend de la formule choisie. Contactez-nous pour un devis personnalisé.',
                'image'      => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
                'ordre'      => 1,
                'actif'      => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question'   => 'Combien de temps dure la formation ?',
                'reponse'    => 'La durée moyenne est de 1 à 3 mois selon votre disponibilité.',
                'image'      => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
                'ordre'      => 2,
                'actif'      => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question'   => 'Quel est le taux de réussite ?',
                'reponse'    => 'Notre taux de réussite dépasse 95% grâce à un encadrement personnalisé.',
                'image'      => 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
                'ordre'      => 3,
                'actif'      => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question'   => 'Puis-je choisir mon moniteur ?',
                'reponse'    => 'Oui, selon disponibilité, vous pouvez choisir votre moniteur.',
                'image'      => 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
                'ordre'      => 4,
                'actif'      => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question'   => 'Les cours sont-ils flexibles ?',
                'reponse'    => 'Nous proposons des horaires flexibles adaptés aux étudiants et salariés.',
                'image'      => 'https://images.unsplash.com/photo-1529070538774-1843cb3265df',
                'ordre'      => 5,
                'actif'      => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'question'   => 'Comment réserver une séance ?',
                'reponse'    => 'La réservation peut se faire directement à l\'agence ou en ligne.',
                'image'      => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                'ordre'      => 6,
                'actif'      => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};