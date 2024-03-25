<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    public function test_api_prevents_guest_access(): void
    {
        // structure similar to "artisan route:list"
        $endpoints = [
            ['api/applications', 'GET', []],
            ['api/applications', 'POST', []],
            ['api/applications/9ba1f6a8-085a-4890-87fb-5a9fd738f633', 'GET', []],
            ['api/applications/9ba1f6a8-085a-4890-87fb-5a9fd738f633', 'DELETE', []],
            // ['api/auth/login', 'POST', []],
            ['api/auth/logout', 'POST', []],
            ['api/auth/me', 'GET', []],
            ['api/races', 'GET', []],
            ['api/races', 'POST', []],
            ['api/races/9ba1b537-d245-4d13-b9e4-4efe5793dd06', 'GET', []],
            ['api/races/9ba1b537-d245-4d13-b9e4-4efe5793dd06', 'PUT', []],
            ['api/races/9ba1b537-d245-4d13-b9e4-4efe5793dd06', 'DELETE', []],
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->json($endpoint[1], $endpoint[0], []);
            $response->assertStatus(401);
            $response->assertExactJson(['message' => 'Unauthenticated.']);
        }
    }

    public function test_user_can_get_jwt_with_correct_credentials(): void
    {
        $response = $this->json('POST', 'api/auth/login', [
            'email' => 'admin02@example.com',
            'password' => 'pass',
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(['access_token', 'token_type', 'expires_in']);
        $response->assertJsonPath('access_token', fn (string $val) => strlen($val) > 0);
    }

    public function test_user_cannot_get_jwt_with_incorrect_credentials(): void
    {
        $response = $this->json('POST', 'api/auth/login', [
            'email' => 'admin02@example.com',
            'password' => 'wrongpass',
        ]);
        $response->assertStatus(401);
        $response->assertExactJson(['error' => 'Unauthorized']);
    }

    public function test_user_can_logout_jwt(): void
    {
        // login
        $response = $this->json('POST', 'api/auth/login', [
            'email' => 'admin02@example.com',
            'password' => 'pass',
        ]);
        $response->assertStatus(200);
        $accessToken = $response['access_token'];
        $this->assertIsString($accessToken);
        $this->assertGreaterThan(0, strlen($accessToken));

        // get me
        $response = $this->json('GET', 'api/auth/me', [], [
            'Authorization' => 'Bearer '.$accessToken,
        ]);
        $response->assertStatus(200);
        $response->assertJsonPath('email', 'admin02@example.com');

        // logout
        $response = $this->json('POST', 'api/auth/logout', [], [
            'Authorization' => 'Bearer '.$accessToken,
        ]);
        $response->assertStatus(200);

        // subsequent logouts with the same token should fail
        $response = $this->json('POST', 'api/auth/logout', [], [
            'Authorization' => 'Bearer '.$accessToken,
        ]);
        $response->assertStatus(401);

        // cannot access me after logout
        $response = $this->json('GET', 'api/auth/me', [], [
            'Authorization' => 'Bearer '.$accessToken,
        ]);
        $response->assertStatus(401);
        $response->assertJsonMissingPath('email');
    }
}
