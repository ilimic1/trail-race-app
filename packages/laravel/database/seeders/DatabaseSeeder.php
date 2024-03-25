<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Race;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $users = collect([
            [
                'id' => '9ba2558d-5568-4266-b01d-a309784c9c17',
                'name' => 'John Admin',
                'first_name' => 'John',
                'last_name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => 'pass',
                'dob' => '1998-07-25',
                'role' => 'administrator',
            ],
            [
                'id' => '9ba2558d-5568-4266-b01d-a309784c9c18',
                'name' => 'John Admin02',
                'first_name' => 'John',
                'last_name' => 'Admin02',
                'email' => 'admin02@example.com',
                'password' => 'pass',
                'dob' => '1998-07-25',
                'role' => 'administrator',
            ],
            [
                'id' => '9ba2558d-5d8e-44a5-b479-33afb46d8cdf',
                'name' => 'John Doe01',
                'first_name' => 'John',
                'last_name' => 'Doe01',
                'email' => 'racer@example.com',
                'password' => 'pass',
                'dob' => '1998-07-25',
                'role' => 'applicant',
                'club' => 'Running Club',
            ],
            [
                'id' => '9ba2558d-5dcf-4d7b-82e6-af7364a743c7',
                'name' => 'John Doe02',
                'first_name' => 'John',
                'last_name' => 'Doe02',
                'email' => 'racer02@example.com',
                'password' => 'pass',
                'dob' => '1998-07-25',
                'role' => 'applicant',
                'club' => null,
            ],
            [
                'id' => '9ba2558d-5dff-4655-9e70-ca470a498749',
                'name' => 'John Doe03',
                'first_name' => 'John',
                'last_name' => 'Doe03',
                'email' => 'racer03@example.com',
                'password' => 'pass',
                'dob' => '1998-07-25',
                'role' => 'applicant',
                'club' => 'Running Club',
            ],
            [
                'id' => '9ba2558d-5e2d-44b3-b2c9-8a3b08ce022e',
                'name' => 'John Doe04',
                'first_name' => 'John',
                'last_name' => 'Doe04',
                'email' => 'racer04@example.com',
                'password' => 'pass',
                'dob' => '1998-07-25',
                'role' => 'applicant',
                'club' => null,
            ],
            [
                'id' => '9ba2558d-69ea-41bd-a06a-02e52ed39396',
                'name' => 'John Doe05',
                'first_name' => 'John',
                'last_name' => 'Doe05',
                'email' => 'racer05@example.com',
                'password' => 'pass',
                'dob' => '1998-07-25',
                'role' => 'applicant',
                'club' => null,
            ],
        ]);

        foreach ($users as $user) {
            User::factory()->create([
                'id' => $user['id'],
                'name' => $user['name'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'email' => $user['email'],
                'password' => $user['password'],
                'dob' => $user['dob'],
                'role' => $user['role'],
            ]);
        }

        $races = [
            [
                'id' => '9ba1b537-d245-4d13-b9e4-4efe5793dd06',
                'name' => 'Trail Race 5K',
                'distance' => '5k',
                'applications' => [],
            ],
            [
                'id' => '9ba1b537-d488-410c-b413-2ffb136ee73f',
                'name' => 'Trail Race 10K',
                'distance' => '10k',
                'applications' => [
                    [
                        'id' => '9ba1f6a8-085a-4890-87fb-5a9fd738f633',
                        'email' => 'racer@example.com',
                    ],
                ],
            ],
            [
                'id' => '9ba1b537-d4b0-47f9-90a5-8499b92fe10e',
                'name' => 'Trail Race HalfMarathon',
                'distance' => 'HalfMarathon',
                'applications' => [
                    [
                        'id' => '9ba1f6a8-0b8d-4365-8d13-1f898b9ba38a',
                        'email' => 'racer@example.com',
                    ],
                    [
                        'id' => '9ba1f6a8-0bb6-46c3-a4ec-dc62c7a8acff',
                        'email' => 'racer02@example.com',
                    ],
                ],
            ],
            [
                'id' => '9ba1b537-d4d2-474a-bf77-1314ba84ca46',
                'name' => 'Trail Race Marathon',
                'distance' => 'Marathon',
                'applications' => [
                    [
                        'id' => '9ba1f6a8-0c12-4776-82ab-72545cbdffa5',
                        'email' => 'racer03@example.com',
                    ],
                    [
                        'id' => '9ba1f6a8-0c38-499e-b1f2-f41012dbfd31',
                        'email' => 'racer04@example.com',
                    ],
                    [
                        'id' => '9ba1f6a8-0c5a-452c-baf4-6b5eb5b7547d',
                        'email' => 'racer05@example.com',
                    ],
                ],
            ],
        ];

        foreach ($races as $race) {
            Race::create([
                'id' => $race['id'],
                'name' => $race['name'],
                'distance' => $race['distance'],
            ]);

            foreach ($race['applications'] as $application) {
                $user = $users->firstOrFail(fn (array $user) => $user['email'] === $application['email']);
                Application::create([
                    'id' => $application['id'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'club' => $user['club'],
                    'user_id' => $user['id'],
                    'race_id' => $race['id'],
                ]);
            }
        }
    }
}
