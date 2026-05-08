<?php
// database/migrations/xxxx_create_cours_table.php
// Commande : php artisan make:migration create_cours_table

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

            // Catégorie du cours
            $table->enum('categorie', [
                'danger',
                'indication',
                'interdiction',
                'code_route',
                'conduite',
                'autre'
            ])->default('autre');

            // Niveau requis
            $table->enum('niveau', [
                'debutant',
                'intermediaire',
                'avance'
            ])->default('debutant');

            // Médias
            $table->string('image', 500)->nullable();    // URL image de couverture
            $table->string('video_url', 500)->nullable(); // Lien YouTube / vidéo
            $table->text('contenu')->nullable();          // Contenu écrit / HTML
            $table->string('pdf_url', 500)->nullable();  // Lien PDF téléchargeable

            // Durée estimée en minutes
            $table->unsignedSmallInteger('duree_minutes')->default(30);

            // Visible ou archivé
            $table->boolean('actif')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};