<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\User;
use Tests\TestCase;

class AdministratorRoleTest extends TestCase
{
    public function test_administrator_can_create_race(): void
    {
        $user = User::where('email', 'admin02@example.com')->firstOrFail();
        $data = ['name' => 'Race', 'distance' => '5k'];
        $response = $this->actingAs($user, 'api')->json('POST', 'api/races', $data);
        $response->assertStatus(201);
        $response->assertJson($data);
    }
}
