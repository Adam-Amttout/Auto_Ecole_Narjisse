<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Client;

class Inscription extends Model
{
    protected $fillable = [
    'client_id',
    'nom',
    'prenom',
    'email',
    'telephone',
    'sujet',
    'message'
];
    // 🔥 RELATION
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}