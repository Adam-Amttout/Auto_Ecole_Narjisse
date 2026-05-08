<?php
// ═══════════════════════════════════════════
// app/Models/Cours.php
// ═══════════════════════════════════════════

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'categorie',
        'niveau',
        'image',
        'video_url',
        'contenu',
        'pdf_url',
        'duree_minutes',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
    ];
}