<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\User;
use Illuminate\Support\Str;
use Tests\TestCase;

class AplicantRoleTest extends TestCase
{
    public function test_applicant_can_create_application(): void
    {
        $user = User::create([
            'name' => 'John Test',
            'first_name' => 'John',
            'last_name' => 'Test',
            'email' => 'racer-test-'.Str::random(10).'@example.com',
            'password' => 'pass',
            'dob' => '1998-07-25',
            'role' => 'applicant',
        ]);
        $data = [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'club' => 'Running Club',
            'user_id' => $user->id,
            'race_id' => '9ba1b537-d4d2-474a-bf77-1314ba84ca46',
        ];
        $response = $this->actingAs($user, 'api')->json('POST', 'api/applications', $data);
        $response->assertStatus(201);
        $response->assertJson($data);
    }

    public function test_applicant_cannot_create_application_for_another_applicant(): void
    {
        $user = User::where('email', 'racer02@example.com')->firstOrFail();
        $anotherUser = User::where('email', 'racer03@example.com')->firstOrFail();
        $data = [
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'club' => 'Running Club',
            'user_id' => $anotherUser->id,
            'race_id' => '9ba1b537-d4d2-474a-bf77-1314ba84ca46',
        ];
        $response = $this->actingAs($user, 'api')->json('POST', 'api/applications', $data);
        $response->assertStatus(403);
    }

    public function test_applicant_cannot_create_race(): void
    {
        $user = User::where('email', 'racer02@example.com')->firstOrFail();
        $data = ['name' => 'Race', 'distance' => '5k'];
        $response = $this->actingAs($user, 'api')->json('POST', 'api/races', $data);
        $response->assertStatus(403);
    }
}
