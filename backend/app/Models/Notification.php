<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'client_id',  // null = globale, sinon privée pour ce client
        'type',
        'titre',
        'message',
        'icon',
        'color',
        'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
