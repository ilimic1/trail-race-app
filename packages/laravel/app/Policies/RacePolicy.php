<?php

namespace App\Policies;

use App\Models\Race;
use App\Models\User;

class RacePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdministrator() || $user->isApplicant();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Race $race): bool
    {
        return $user->isAdministrator();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdministrator();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Race $race): bool
    {
        return $user->isAdministrator();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Race $race): bool
    {
        return $user->isAdministrator();
    }

    public function restore(User $user, Race $race): bool
    {
        return $user->isAdministrator();
    }

    public function forceDelete(User $user, Race $race): bool
    {
        return $user->isAdministrator();
    }
}
