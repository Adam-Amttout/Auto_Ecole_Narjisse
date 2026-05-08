<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avis', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom')->nullable();
            $table->string('role_label')->nullable(); // ex: "Permis B obtenu en 20h"
            $table->text('texte');
            $table->unsignedTinyInteger('note')->default(5); // 1-5
            $table->string('photo_url')->nullable();
            $table->enum('statut', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avis');
    }
};
