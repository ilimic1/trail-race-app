<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'user_id' => 'string|uuid',
        ]);

        $user_id = $request->input('user_id');
        Gate::authorize('viewOwn', [Application::class, $user_id]);

        $query = Application::query()->with('race');

        if ($user_id) {
            $query->where('user_id', $user_id);
        }

        return $query->get();
    }

    public function store(StoreApplicationRequest $request)
    {
        $user_id = $request->input('user_id');
        Gate::authorize('create', [Application::class, $user_id]);

        $validated = $request->validated();

        return Application::create($validated);
    }

    public function show(Application $application)
    {
        Gate::authorize('view', [$application]);

        return $application;
    }

    public function destroy(Application $application)
    {
        Gate::authorize('delete', [$application]);
        $application->delete();

        return response(['success' => 'Race has been deleted'], 204);
    }
}
