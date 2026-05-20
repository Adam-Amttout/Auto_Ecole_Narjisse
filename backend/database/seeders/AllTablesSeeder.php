<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AllTablesSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ClientsSeeder::class,
            MoniteursSeeder::class,
            VehiculesSeeder::class,
            InscriptionsSeeder::class,
            CoursSeeder::class,
            SeancesConduiteSeeder::class,
            AvisSeeder::class,
            ContactMessagesSeeder::class,
            ProgressionSeeder::class,
            NotificationsSeeder::class,
            ExamResultsSeeder::class,
            DossiersAdministratifsSeeder::class,
        ]);

        $this->command->info('✅ Toutes les tables ont été remplies avec succès !');
    }
}
