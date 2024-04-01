<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Race extends Model
{
    use HasUuids, SoftDeletes;

    public $fillable = ['name', 'distance'];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
