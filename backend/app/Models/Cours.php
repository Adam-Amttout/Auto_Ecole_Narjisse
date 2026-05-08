<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'categorie',
        'image',
        'niveau',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
    ];
}