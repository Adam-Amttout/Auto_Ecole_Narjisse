<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Client::updateOrCreate(
            ['email' => 'admin@narjiss.ma'],
            [
                'nom'      => 'Admin',
                'prenom'   => 'Narjisse',
                'password' => Hash::make('password123'),
                'role'     => 'admin',
            ]
        );

        Client::updateOrCreate(
            ['email' => 'eleve@narjiss.ma'],
            [
                'nom'      => 'Eleve',
                'prenom'   => 'Test',
                'password' => Hash::make('password123'),
                'role'     => 'user',
            ]
        );
    }
}
