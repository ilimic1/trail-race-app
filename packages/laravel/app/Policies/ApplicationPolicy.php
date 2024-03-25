<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewOwn(User $user, ?string $user_id): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        if ($user_id && $user->id === $user_id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Application $application): bool
    {
        return $user->isAdministrator() || $user->id === $application->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, ?string $user_id): bool
    {
        if ($user->isAdministrator()) {
            return true;
        }

        if ($user_id && $user->id === $user_id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Application $application): bool
    {
        return $user->isAdministrator() || $user->id === $application->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Application $application): bool
    {
        return true;
        // return $user->isAdministrator();
    }
}
