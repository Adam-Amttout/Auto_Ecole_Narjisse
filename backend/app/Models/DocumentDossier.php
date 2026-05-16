<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentDossier extends Model
{
    protected $table = 'documents_dossier';

    protected $fillable = [
        'client_id',
        'type',
        'nom_fichier',
        'chemin',
        'statut',
        'remarque',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    // URL publique accessible
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->chemin);
    }

    protected $appends = ['url'];
}
