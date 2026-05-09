<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $table = 'contact_messages';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'sujet',
        'message',
        'lu',
        'reponse_admin',
        'repondu_le',
        'statut',
    ];

    protected $casts = [
        'lu'          => 'boolean',
        'repondu_le'  => 'datetime',
    ];
}