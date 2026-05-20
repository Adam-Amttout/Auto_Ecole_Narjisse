<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProgressionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $clientIds = DB::table('clients')->where('role', 'user')->pluck('id')->toArray();
        $coursIds  = DB::table('cours')->pluck('id')->toArray();

        if (empty($clientIds) || empty($coursIds)) {
            $this->command->warn('  ⚠️ Clients ou cours manquants, progression non insérée.');
            return;
        }

        $inserted = 0;
        foreach ($clientIds as $clientId) {
            // Chaque client a complété entre 1 et 6 cours aléatoires
            $nbCours = rand(1, min(6, count($coursIds)));
            $selectedCours = array_rand(array_flip($coursIds), $nbCours);
            if (!is_array($selectedCours)) $selectedCours = [$selectedCours];

            foreach ($selectedCours as $coursId) {
                DB::table('progression')->updateOrInsert(
                    ['client_id' => $clientId, 'cours_id' => $coursId],
                    [
                        'created_at' => $now->copy()->subDays(rand(1, 60)),
                        'updated_at' => $now,
                    ]
                );
                $inserted++;
            }
        }

        $this->command->info("  ✅ {$inserted} progressions insérées");
    }
}
