<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeanceConduite extends Model
{
    protected $table = 'seances_conduite';

    protected $fillable = [
        'client_id',
        'moniteur_id',
        'vehicule_id',
        'date',
        'heure_debut',
        'heure_fin',
        'statut',
        'notes',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];

    /** ⚠️ Relation vers votre modèle Client (pas User) */
    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function moniteur()
    {
        return $this->belongsTo(Moniteur::class, 'moniteur_id');
    }

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class, 'vehicule_id');
    }
}