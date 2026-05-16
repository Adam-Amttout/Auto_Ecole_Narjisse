<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id');
            $table->integer('score');           // nombre de bonnes réponses
            $table->integer('total');           // total questions (40)
            $table->integer('duree_secondes')->nullable(); // temps passé
            $table->boolean('reussi');          // score >= 35/40 (87.5%)
            // Détail par catégorie: {"danger": {"score":3,"total":5}, ...}
            $table->json('detail_categories')->nullable();
            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('exam_results');
    }
};
