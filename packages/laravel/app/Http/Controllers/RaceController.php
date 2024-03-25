<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRaceRequest;
use App\Http\Requests\UpdateRaceRequest;
use App\Models\Race;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RaceController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', [Race::class]);

        return Race::with('applications')->get();
    }

    public function store(StoreRaceRequest $request)
    {
        Gate::authorize('create', [Race::class]);

        $validated = $request->validated();

        return Race::create($validated);
    }

    public function show(Race $race)
    {
        Gate::authorize('view', [$race]);

        return $race;
    }

    public function update(UpdateRaceRequest $request, Race $race)
    {
        Gate::authorize('update', [$race]);

        $race->fill($request->validated());
        $race->save();

        return $race;
    }

    public function destroy(Race $race)
    {
        Gate::authorize('delete', [$race]);
        $race->delete();

        return response(['success' => 'Race has been deleted'], 204);
    }
}
