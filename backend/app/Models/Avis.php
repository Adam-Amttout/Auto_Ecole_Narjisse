<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avis extends Model
{
    protected $table = 'avis';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'role_label',
        'texte',
        'note',
        'photo_url',
        'statut',
    ];
}
