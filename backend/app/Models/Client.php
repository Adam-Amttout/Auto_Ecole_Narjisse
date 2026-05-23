<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Inscription;
use App\Models\SeanceConduite; // ← ajouter

class Client extends Authenticatable
{
    protected $table = 'clients';

    protected $fillable = [
        'nom', 'prenom', 'email', 'password', 'role', 'photo_profil', 'telephone'
    ];

    protected $hidden = [
        'password', 'remember_token'
    ];

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    // ← NOUVEAU : relation séances
    public function seances()
    {
        return $this->hasMany(SeanceConduite::class, 'client_id');
    }
    public function cours()
    {
        return $this->belongsToMany(Cours::class, 'cours_clients')
                    ->withTimestamps();
    }
}