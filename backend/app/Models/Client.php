<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Inscription;

class Client extends Authenticatable
{
    protected $table = 'clients';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    // 🔥 RELATION
    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}