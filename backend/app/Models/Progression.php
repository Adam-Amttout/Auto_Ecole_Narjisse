<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Progression extends Model
{
    protected $table = 'progression';

    protected $fillable = [
        'client_id',
        'cours_id',
    ];
}
